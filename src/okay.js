(function() {
  'use strict';
  var Okay, EmissionContext;
  window.Okay = Okay = {};
  Okay.emit = require('./emit');
  EmissionContext = require('./emission_context');

  window.addEventListener('change', function(e) {
    var emissionData;
    if (e.target.dataset.emit) {
      emissionData = JSON.parse(e.target.dataset.emit);
      var emissionContext = new EmissionContext(e.target, emissionData);
      var context = emissionContext.context();
      Okay.emit(context);
    }
  });
}());
