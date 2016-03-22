(function() {
  'use strict';

  var Okay, watchers;
  window.Okay = Okay = {};
  watchers = {};

  function getTargetConfigForWatcherName(target, watcherName) {
    var rawOptions, parsedOptions;
    rawOptions = target.getAttribute('data-watch-'+watcherName);
    parsedOptions = JSON.parse(rawOptions);
    return parsedOptions;
  }

  function applyWatcher(target, watcherName, watcher, emittedData) {
    var targetConfig;

    targetConfig = getTargetConfigForWatcherName(target, watcherName);
    if (!targetConfig) return;

    for (var name in emittedData) {
      if (targetConfig[name]) {
        watcher(target, targetConfig[name], emittedData[name]);
      }
    }
  }

  function eachWatcher(callback) {
    for (var watcherName in watchers) {
      callback.call(this, watcherName, watchers[watcherName]);
    }
  }

  /* Tell watchers something has changed */
  Okay.emit = function (emittedData) {
    var targets, i, ii, selectors;

    selectors = [];

    eachWatcher(function(watcherName) {
      selectors.push('[data-watch-'+watcherName+']');
    });

    targets = document.querySelectorAll(selectors.join(','));

    for (i = 0, ii = targets.length; i < ii; i++) {
      eachWatcher(function(watcherName, watcher) {
        applyWatcher(targets[i], watcherName, watcher, emittedData);
      });
    }
  };

  /* Define Watchers */
  watchers.class = function applyClass(target, name, value) {
    target.classList.toggle(name, value);
  };

  watchers.attr = function applyAttr(target, name, value) {
    target.setAttribute(name, value);
  };
}());
