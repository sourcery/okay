(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function each(collection, callback) {
  for (var i in collection) {
    callback(collection[i], i);
  }
};

module.exports = each;

},{}],2:[function(require,module,exports){
var emit = require('./emit');
var each = require('./each');
var transforms = require('./transforms');

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

  each(data, function(dataValue, dataKey) {
    each(transforms, function(transform, transformName) {
      if (dataValue == transformName) {
        context[dataKey] = transform(target, dataKey, context);
      }
    });

    if (context[dataKey] == undefined) context[dataKey] = data[dataKey];
  });

  return context;
};

module.exports = EmissionContext;
},{"./each":1,"./emit":3,"./transforms":6}],3:[function(require,module,exports){
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

},{"./notifier":4,"./watchers":7}],4:[function(require,module,exports){
var each = require('./each');

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
  var emittedData = this.emittedData;
  var config = this.config;
  var watcher = this.watcher;
  var target = this.target;
  if (!config) return;

  each(config, function(configValue, configKey) {
    var watcherValue;

    each(configKey.split(','), function(match) {
      each(emittedData, function(dataValue, dataKey) {
        if (watcherValue) return;
        if (match == dataKey) watcherValue = dataValue;
      });
    });

    if (watcherValue != undefined) watcher(target, config[configKey], watcherValue, config);
  });
};

Notifier.dispatch = function(watcherName, watcher, emittedData) {
  var targets, i, ii;

  targets = document.querySelectorAll('[data-watch-'+watcherName+']');
  for (i = 0, ii = targets.length; i < ii; i++) {
    new Notifier(watcherName, watcher, targets[i], emittedData).update();
  }
};

module.exports = Notifier;
},{"./each":1}],5:[function(require,module,exports){
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

},{"./emission_context":2,"./emit":3}],6:[function(require,module,exports){
var transforms = {};

transforms['[checked]'] = function(target) {
  return target.checked;
};

transforms['![checked]'] = function(target) {
  return !target.checked;
};


transforms['[options]'] = function(target, contextKey, context) {
  var selectedOptionValue;
  var options = target.children;

  function updateContextForOption(option) {
    var selected, name;
    selected = option.selected == true;
    name = option.getAttribute('name');
    context[contextKey+'['+name+']'] = selected;
    if (selected) selectedOptionValue = name;
  }

  for (var i = 0, ii = options.length; i < ii; i++) {
    updateContextForOption(options[i]);
  }

  return selectedOptionValue;
};

module.exports = transforms;
},{}],7:[function(require,module,exports){
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

},{}]},{},[5]);
