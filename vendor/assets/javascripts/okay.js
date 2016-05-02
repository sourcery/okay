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
},{"./each":1,"./emit":3,"./transforms":7}],3:[function(require,module,exports){
var Notifier = require('./notifier');
var each = require('./each');

module.exports = function emit(emittedData, watchers) {
  each(watchers, function(watcher, watcherName) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
};

},{"./each":1,"./notifier":5}],4:[function(require,module,exports){
var log = [];

log.logEvent = function(e) {
  var logEntry;
  logEntry= [ e.type, e.toString() ];
  logEntry.push([ e.target.tagName, e.target.id, e.target.textContent ]);

  var data;
  try {
    data = JSON.parse(e.target.dataset.emit || e.currentTarget.dataset.emit);
    logEntry.push(data);
  } catch (e) {}

  log.push(logEntry);
};

module.exports = log;
},{}],5:[function(require,module,exports){
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
    (function() {
      var currentTarget;
      var notify;

      currentTarget = targets[i];
      var notify = function () {
        new Notifier(watcherName, watcher, currentTarget, emittedData).update();
      };

       //Let stack clear.
      setTimeout(notify);
    }());
  }
};

module.exports = Notifier;
},{"./each":1}],6:[function(require,module,exports){
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

},{"./emission_context":2,"./emit":3,"./log":4,"./watchers":8}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
exports.class = function applyClass(target, className, value) {
  var method = value ? 'add' : 'remove';
  target.classList[method](className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  target.removeAttribute(attrName);
  if (value) target.setAttribute(attrName, value);

  if (attrName == 'checked') {
    target.checked = value;
    var event = new Event('change', { bubbles: true, cancelable: false });
    target.dispatchEvent(event);
  }
};

exports.html = function applyHTML(target, setting, value, config) {
  if (setting == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (setting == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};

},{}]},{},[6]);
