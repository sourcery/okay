(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function each(collection, callback) {
  for (var i in collection) {
    callback(collection[i], i);
  }
};

module.exports = each;

},{}],2:[function(require,module,exports){
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

},{"./each":1,"./watchers-jquery":3}],3:[function(require,module,exports){
exports.html = function applyHTML(target, setting, value, config) {
  if (setting == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (setting == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};

exports.class = function applyClass(target, className, value) {
  $(target).toggleClass(className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  var $target, previousValue;

  $target = $(target);
  if (attrName == 'value') previousValue = $target.val();

  $target.removeProp(attrName);
  if (value) $(target).prop(attrName, value);

  function triggerChangeEvent() {
    setTimeout(function () { $target.trigger('change'); });
  }

  if (attrName == 'checked') {
    target.checked = value;
    triggerChangeEvent();
  }

  if (attrName == 'value' && previousValue != value.toString()) {
    triggerChangeEvent();
  }
};

},{}]},{},[2]);
