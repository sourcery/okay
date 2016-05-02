(function() {
  'use strict';
  var Okay, EmissionContext, listener;
  window.Okay = Okay = {};
  if (!Okay) Okay = {};

  Okay.emit = require('./emit');
  Okay.watchers = require('./watchers');
  Okay.log = require('./log');
  EmissionContext = require('./emission_context');

  Okay.eventListener = listener = function (e) {var elementInfo = [];
    var emissionJSON;
    var emissionData;
    Okay.log.logEvent(e);

    function hasDataset(target) {
      return target && target.dataset && target.dataset.emit;
    }

    if (hasDataset(e.target)) emissionJSON = e.target.dataset.emit;
    else if (hasDataset(e.currentTarget)) emissionJSON = e.target.dataset.emit;

    if (emissionJSON) {
      emissionData = JSON.parse(emissionJSON);
      var emissionContext = new EmissionContext(e.target, emissionData);
      var context = emissionContext.context();
      Okay.emit(context, Okay.watchers);
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
}());
