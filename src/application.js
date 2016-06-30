var each = require('./each');
var count = require('./count');
var benchmark = require('./benchmark');
var Timer = require('./timer');
var mergeToHash = require('./merge-to-hash');
var GetDataFromEvent = require('./get-data-from-event');
var AcquireTargetsForWatcher = require('./acquire-targets-for-watcher');
var PerformWatcher = require('./perform-watcher');
var defaultWatchers = require('./watchers');
var log = require('./log');

function Application(adapter) {
  var application = this;

  this.timer = new Timer(this, 'performWatchers');

  this.listener = function(e) {
    application.processEvent(e);
  };

  this.setAdapter(adapter);
}

Application.prototype.processEvent = function(e) {
  var app, timer, result, data;

  app = this;
  timer = app.timer;

  result = GetDataFromEvent.perform({
    event: e
  });
  data = result.data;

  if (timer.running === true) timer.push(data);
  else app.performWatchers([data]);
};

Application.prototype.performWatchers = function(data) {
  var watchers, emittedData;

  emittedData = mergeToHash(data);
  watchers = this.watchers;

  each(watchers, function (watcher, watcherName) {
    var targets, elapsed;

    targets = AcquireTargetsForWatcher(watcherName);

    elapsed = benchmark(function () {
      each(targets, function (target) {
        PerformWatcher(watcherName, watcher, target, emittedData);
      });
    });

    if (count(emittedData) > 0) {
      log.log('state', {
        state: emittedData,
        elapsed: elapsed
      });
    }
  });
};

Application.prototype.setAdapter = function(adapter) {
  if (this.adapter) this.adapter.clearEventListeners(this);
  this.adapter = adapter;
  this.adapter.setEventListeners(this);
  this.watchers = mergeToHash([ defaultWatchers, this.adapter.watchers ]);
};

module.exports = Application;
