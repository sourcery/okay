var perform = require('node-interactor');
var slice = require('./slice');
var each = require('./each');
var Notifier = require('./notifier');
function PerformWatcherOnTarget() {}
module.exports = PerformWatcherOnTarget;
PerformWatcherOnTarget.perform = perform;

PerformWatcherOnTarget.prototype.perform = function() {
  var name = this.context.name;
  var watcher = this.context.watcher;
  var target = this.context.target;
  var emittedData = this.context.emittedData;
  var notifier = new Notifier(name, watcher, target, emittedData);
  notifier.update();
};
