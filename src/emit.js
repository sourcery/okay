var Notifier = require('./notifier');
var watchers = require('./watchers');
var each = require('./each');

module.exports = function emit(emittedData) {
  each(watchers, function(watcher, watcherName) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
};
