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
  if (!this.config) return;

  for (var name in this.emittedData) {
    if (this.config[name]) {
      this.watcher(this.target, this.config[name], this.emittedData[name]);
    }
  }
};

Notifier.dispatch = function(watcherName, watcher, emittedData) {
  var targets, i, ii;

  targets = document.querySelectorAll('[data-watch-'+watcherName+']');
  for (i = 0, ii = targets.length; i < ii; i++) {
    new Notifier(watcherName, watcher, targets[i], emittedData).update();
  }
};

module.exports = Notifier;