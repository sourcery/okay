(function() {
  'use strict';

  var Okay;
  Okay = window.Okay;
  if (!Okay) Okay = {};

  Okay.jQuery = {};
  Okay.jQuery.watchers = require('./watchers-jquery');

  Okay.jQuery.setEventListeners = function(application) {
    $(document).on('change', '[data-emit]', application.listener);
    $(document).on('click', '[data-emit]', application.listener);
  };

  Okay.jQuery.clearEventListeners = function(application) {
    $(document).off('change', application.listener);
    $(document).off('click', application.listener);
  };
}());
