var slice = require('./slice');

module.exports = function AcquireTargetsForWatcher(name) {
  return slice(document.querySelectorAll('[data-watch-'+name+']'));
};
