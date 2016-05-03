(function() {
  'use strict';

  var Okay;
  var jqueryWatchers = require('./watchers-jquery');
  var each = require('./each');
  var originalWatchers;

  Okay = window.Okay;
  if (!Okay) Okay = {};

  Okay.jQuery = {};
  Okay.jQuery.use = function () {
    originalWatchers = {};

    each([ 'html', 'attr', 'class' ], function(watcher) {
      originalWatchers[watcher] = Okay.watchers[watcher];
      Okay.watchers[watcher] = jqueryWatchers[watcher];
    });

    Okay.clearEventListeners();
    $(document).on('change', '[data-emit]', Okay.eventListener);
    $(document).on('click', '[data-emit]', Okay.eventListener);
  };

  Okay.jQuery.doNotUse = function () {
    if (!originalWatchers) return;
    each(['attr', 'class', 'html' ], function(watcher) {
      Okay.watchers[watcher] = originalWatchers[watcher];
    });

    originalWatchers = false;
    Okay.setEventListeners();
    $(document).off('change', Okay.eventListener);
    $(document).off('click', Okay.eventListener);
  };
}());
