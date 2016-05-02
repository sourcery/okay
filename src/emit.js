var Notifier = require('./notifier');
var each = require('./each');

module.exports = function emit(emittedData, watchers) {
  each(watchers, function(watcher, watcherName) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
};
