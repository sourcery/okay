var perform = require('node-interactor');
var slice = require('./slice');
var each = require('./each');
function AcquireTargetsForWatcher() {}
module.exports = AcquireTargetsForWatcher;
AcquireTargetsForWatcher.perform = perform;

AcquireTargetsForWatcher.prototype.perform = function() {
  var name = this.context.name;
  this.context.targets = slice(document.querySelectorAll('[data-watch-'+name+']'));
};
