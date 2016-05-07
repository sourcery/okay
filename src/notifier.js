var each = require('./each');
var log = require('./log');

function Notifier(name, watcher, target, emittedData) {
  this.name = name;
  this.watcher = watcher;
  this.target = target;
  this.emittedData = emittedData;
  this.config = this.getConfig();
}

Notifier.prototype.getConfig = function() {
  var rawOptions, parsedOptions;
  rawOptions = this.target.getAttribute('data-watch-'+this.name);
  parsedOptions = JSON.parse(rawOptions);
  return parsedOptions;
};

Notifier.prototype.update = function() {
  var emittedData = this.emittedData;
  var config = this.config;
  var watcher = this.watcher;
  var target = this.target;
  if (!config) return;

  each(config, function(configValue, configKey) {
    var watcherValue;

    each(configKey.split(','), function(match) {
      var inverted;

      if (match.slice(0, 1) === '!') {
        inverted = true;
        match = match.replace(/^!/, '')
      }

      each(emittedData, function(dataValue, dataKey) {
        if (watcherValue) return;
        if (match == dataKey) watcherValue = (inverted ? !dataValue : dataValue);
      });
    });

    if (watcherValue != undefined) {
      log.log('watcher', {
        watcher: watcher.name,
        argument: config[configKey],
        value: watcherValue,
        target: log.target(target),
        config: config
      });

      watcher(target, config[configKey], watcherValue, config);
    }
  });
};

Notifier.dispatch = function(watcherName, watcher, emittedData) {
  var targets, i, ii;

  targets = document.querySelectorAll('[data-watch-'+watcherName+']');

  for (i = 0, ii = targets.length; i < ii; i++) {
    (function() {
      var currentTarget;
      var notify;

      currentTarget = targets[i];
      var notify = function () {
        new Notifier(watcherName, watcher, currentTarget, emittedData).update();
      };

       //Let stack clear.
      setTimeout(notify);
    }());
  }
};

module.exports = Notifier;