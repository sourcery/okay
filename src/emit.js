var Notifier = require('./notifier');
var watchers = require('./watchers');

function eachWatcher(callback) {
  for (var watcherName in watchers) {
    callback.call(this, watcherName, watchers[watcherName]);
  }
}

module.exports = function emit(emittedData) {
  eachWatcher(function(watcherName, watcher) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
};
