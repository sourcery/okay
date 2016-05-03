var each = require('./each');

function Timer(Okay) {
  this.Okay = Okay;
  this.stack = [];
}

Timer.prototype.start = function() {
  var timer = this;
  this.interval = window.setInterval(function () {
    timer.clear();
  }, 150);
};

Timer.prototype.stop = function() {
  window.clearInterval(this.interval);
};

Timer.prototype.push = function(item) {
  this.stack.push(item);
};

Timer.prototype.clear = function() {
  var Okay = this.Okay;
  var itemsToClear = Array.prototype.slice.apply(this.stack);
  var computedState = {};
  this.stack = [];

  if (itemsToClear.length == 0) return;

  each(itemsToClear, function(item) {
    each(item, function(val, key) {
      computedState[key] = val;
    });
  });

  Okay.log.logState(computedState, itemsToClear, function() {
    Okay.emit(computedState, Okay.watchers);
  });
};

module.exports = Timer;