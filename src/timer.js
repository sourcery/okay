var each = require('./each');
var slice = require('./slice');

function Timer(Okay, clearEvery) {
  this.Okay = Okay;
  this.stack = [];
  this.running = false;
  this.clearEvery = clearEvery || 10;
}

Timer.prototype.start = function() {
  var timer = this;

  function clear() { timer.clear(); }
  timer.interval = window.setInterval(clear, timer.clearEvery);
  timer.running = true;
};

Timer.prototype.stop = function() {
  window.clearInterval(this.interval);
  this.running = false;
};

Timer.prototype.push = function(item) {
  this.stack.push(item);
};

Timer.prototype.clear = function() {
  var Okay = this.Okay;
  var computedState;

  computedState = Timer.getStateForTimer(this);
  if (computedState) Okay.emit(computedState, Okay.watchers);
};

Timer.getStateForTimer = function(timer) {
  var itemsToClear, computedState;

  itemsToClear = slice(timer.stack);
  timer.stack = [];

  if (itemsToClear.length == 0) return false;

  computedState  = {};
  each(itemsToClear, function(item) {
    each(item, function(val, key) {
      computedState[key] = val;
    });
  });

  return computedState;
};

module.exports = Timer;
