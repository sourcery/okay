(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var emit = require('./emit');
var transforms = require('./transforms');

function eachTransform(callback) {
  for (var i in transforms) {
    callback(i, transforms[i]);
  }
};

function EmissionContext(target, data) {
  this.target = target;
  this.data = data;
};

EmissionContext.prototype.context = function() {
  var data;
  var context;
  var target;

  data = this.data;
  target = this.target;
  context = {};

  for (var i in data) {
    eachTransform(function(transformName, transform) {
      if (data[i] == transformName) {
        context[i] = transform(target)
      }
    });

    if (context[i] == undefined) context[i] = data[i];
  }

  return context;
};

module.exports = EmissionContext;
},{"./emit":2,"./transforms":5}],2:[function(require,module,exports){
var Notifier = require('./notifier');
var watchers = require('./watchers');

function eachWatcher(callback) {
  for (var watcherName in watchers) {
    callback.call(this, watcherName, watchers[watcherName]);
  }
}

module.exports = function emit(emittedData) {
  eachWatcher(function(watcherName, watcher) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
};

},{"./notifier":3,"./watchers":6}],3:[function(require,module,exports){
function Notifier(name, watcher, target, emittedData) {
  this.name = name;
  this.watcher = watcher;
  this.target = target;
  this.emittedData = emittedData;
  this.config = this.getConfig();
}

Notifier.prototype.getConfig = function() {
  var rawOptions, parsedOptions;
  rawOptions = this.target.getAttribute('data-watch-'+this.name);
  parsedOptions = JSON.parse(rawOptions);
  return parsedOptions;
};

Notifier.prototype.update = function() {
  if (!this.config) return;

  for (var name in this.emittedData) {
    if (this.config[name]) {
      this.watcher(this.target, this.config[name], this.emittedData[name], this.config[name]);
    }
  }
};

Notifier.dispatch = function(watcherName, watcher, emittedData) {
  var targets, i, ii;

  targets = document.querySelectorAll('[data-watch-'+watcherName+']');
  for (i = 0, ii = targets.length; i < ii; i++) {
    new Notifier(watcherName, watcher, targets[i], emittedData).update();
  }
};

module.exports = Notifier;
},{}],4:[function(require,module,exports){
(function() {
  'use strict';
  var Okay, EmissionContext;
  window.Okay = Okay = {};
  Okay.emit = require('./emit');
  EmissionContext = require('./emission_context');

  window.addEventListener('change', function(e) {
    var emissionData;
    emissionData = JSON.parse(e.target.dataset.emit);
    var emissionContext = new EmissionContext(e.target, emissionData);
    var context = emissionContext.context();
    Okay.emit(context);
  });
}());

},{"./emission_context":1,"./emit":2}],5:[function(require,module,exports){
var transforms = {};

transforms['[checked]'] = function(target) {
  return target.checked;
};

transforms['![checked]'] = function(target) {
  return !target.checked;
};

module.exports = transforms;
},{}],6:[function(require,module,exports){
exports.class = function applyClass(target, name, value) {
  target.classList.toggle(name, value);
};

exports.attr = function applyAttr(target, name, value) {
  target.removeAttribute(name);
  if (value) target.setAttribute(name, value);
};

exports.html = function applyAttr(target, name, value, config) {
  if (config == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (config == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};

},{}]},{},[4]);
