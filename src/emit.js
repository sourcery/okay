var Notifier = require('./notifier');
var each = require('./each');
var callbacks = [];

function emit(emittedData, watchers) {
  var started, ended;

  started = +new Date;
  each(watchers, function(watcher, watcherName) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
  ended = +new Date;

  each(callbacks, function(callback) {
    callback(emittedData, ended - started);
  });
};

emit.onEmit = function(callback) {
  callbacks.push(callback);
};

module.exports = emit;
