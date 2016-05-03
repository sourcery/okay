(function() {
  'use strict';
  var Okay, EmissionContext, listener, stack;

  window.Okay = Okay = {};
  if (!Okay) Okay = {};

  var each = require('./each');
  var Timer = require('./timer');
  Okay.emit = require('./emit');
  Okay.watchers = require('./watchers');
  Okay.log = require('./log');
  Okay.timer = new Timer(Okay);
  EmissionContext = require('./emission_context');

  Okay.eventListener = listener = function (e) {var elementInfo = [];
    var emissionJSON;
    var emissionData;
    var possibleTargets;

    Okay.log.logEvent(e);

    possibleTargets = e.path ? Array.prototype.slice.apply(e.path) : [];
    if (e.currentTarget != document) possibleTargets.unshift(e.currentTarget);
    possibleTargets.unshift(e.target);

    function hasDataset(target) {
      return target && target.dataset && target.dataset.emit;
    }

    each(possibleTargets, function(target) {
      if (!emissionJSON && hasDataset(target)) emissionJSON = target.dataset.emit;
    });

    if (emissionJSON) {
      emissionData = JSON.parse(emissionJSON);
      var emissionContext = new EmissionContext(e.target, emissionData);
      var context = emissionContext.context();
      Okay.timer.push(context);
    }
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
