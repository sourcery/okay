(function() {
  'use strict';
  var Okay, Application, adapter, watchers;

  window.Okay = Okay = {};
  if (!Okay) Okay = {};
  Okay.log = require('./log');

  Application = require('./application');
  adapter = require('./base');
  watchers = require('./watchers');

  Okay.application = new Application(adapter);
  Okay.application.timer.start();
}());
