var each = require('./each');
var slice = require('./slice');

function Timer(delegate, message, clearEvery) {
  this.delegate = delegate;
  this.message = message;
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
  var delegate, message, itemsToClear;

  delegate = this.delegate;
  message = this.message;
  itemsToClear = slice(this.stack);
  this.stack = [];
  delegate[message].call(delegate, itemsToClear);
};

module.exports = Timer;
