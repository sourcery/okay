(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  'use strict';

  var Okay;
  Okay = window.Okay;
  if (!Okay) Okay = {};

  Okay.jQuery = {};
  Okay.jQuery.watchers = require('./watchers-jquery');

  Okay.jQuery.setEventListeners = function(application) {
    $(document).on('change', '[data-emit]', application.listener);
    $(document).on('keyup', '[data-emit]', application.listener);
    $(document).on('click', '[data-emit]', application.listener);
  };

  Okay.jQuery.clearEventListeners = function(application) {
    $(document).off('change', application.listener);
    $(document).off('keyup', application.listener);
    $(document).off('click', application.listener);
  };
}());

},{"./watchers-jquery":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
