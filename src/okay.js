(function() {
  'use strict';
  var Okay, EmissionContext, listener, stack;

  window.Okay = Okay = {};
  if (!Okay) Okay = {};

  var Timer = require('./timer');
  var Emitter = require('./emitter');
  Okay.emit = require('./emit');
  Okay.watchers = require('./watchers');
  Okay.log = require('./log');
  Okay.timer = new Timer(Okay);

  Okay.emit.onEmit(function(state, elapsed) {
    Okay.log.log('state', { state: state, elapsed: elapsed });
  });

  Okay.eventListener = listener = function (e) {
    var emitter, timer;

    if (Okay.timer.running === true) timer = Okay.timer;
    emitter = Emitter.fromEvent(e, timer, Okay.watchers);
    emitter.call();
  };

  Okay.setEventListeners = function() {
    window.addEventListener('change', listener);
    window.addEventListener('click', listener);
    document.addEventListener('change', listener);
    document.addEventListener('click', listener);
  };

  Okay.clearEventListeners = function() {
    window.removeEventListener('change', listener);
    window.removeEventListener('click', listener);
    document.removeEventListener('change', listener);
    document.removeEventListener('click', listener);
  };

  Okay.setEventListeners();
  Okay.timer.start();
}());
