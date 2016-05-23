(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var eventMap = {
  submit: 'Events',
  change: 'HTMLEvents'
};

function dispatchDOMEvent(target, type) {
  var event, cancelled;

  if ("createEvent" in document) {
    event = document.createEvent(eventMap[type]);
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
    cancelled = event.defaultPrevented || event.cancelBubble;
  } else {
    cancelled = target.fireEvent("on"+type);
  }

  return cancelled;
}

module.exports = dispatchDOMEvent;
},{}],2:[function(require,module,exports){
function each(collection, callback) {
  for (var i in collection) {
    callback(collection[i], i);
  }
};

module.exports = each;

},{}],3:[function(require,module,exports){
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
      if (new RegExp(transformName).test(dataValue)) {
        context[dataKey] = transform(target, dataKey, context, dataValue);
      }
    });

    if (context[dataKey] == undefined) context[dataKey] = data[dataKey];
  });

  return context;
};

module.exports = EmissionContext;
},{"./each":2,"./emit":4,"./transforms":11}],4:[function(require,module,exports){
var Notifier = require('./notifier');
var each = require('./each');
var callbacks = [];

function emit(emittedData, watchers) {
  var started, ended;

  started = +new Date;
  each(watchers, function(watcher, watcherName) {
    Notifier.dispatch(watcherName, watcher, emittedData);
  });
  ended = +new Date;

  each(callbacks, function(callback) {
    callback(emittedData, ended - started);
  });
};

emit.onEmit = function(callback) {
  callbacks.push(callback);
};

module.exports = emit;

},{"./each":2,"./notifier":7}],5:[function(require,module,exports){
var slice = require('./slice');
var each = require('./each');
var log = require('./log');
var emit = require('./emit');
var EmissionContext = require('./emission_context');

function Emitter(target, data, timer, watchers) {
  this.target = target;
  this.data = data;
  this.timer = timer;
  this.watchers = watchers
};

Emitter.prototype.call = function() {
  var timer, data, watchers;

  timer = this.timer;
  data = this.data;
  watchers = this.watchers;

  if (timer) timer.push(data);
  else emit(data, watchers);
};

function determineTarget(e) {
  var target, possibleTargets;

  possibleTargets = e.path ? slice(e.path) : [];
  if (e.currentTarget != document) possibleTargets.unshift(e.currentTarget);
  possibleTargets.unshift(e.target);

  each(possibleTargets, function (eachTarget) {
    var dataset;
    if (!target && eachTarget && (dataset = eachTarget.dataset) && dataset.emit) {
      target = eachTarget;
    }
  });

  return target;
}

Emitter.fromEvent = function (e, timer, watchers) {
  var target, json, data, context;

  target = determineTarget(e);

  if (target) {
    json = target.dataset.emit;
    data = typeof json === 'string' ? JSON.parse(json) : json;
    log.logEvent(e, data);
    context = new EmissionContext(e.target, data);
    context = context.context();
  }

  return new Emitter(target, context, timer, watchers);
};

module.exports = Emitter;
},{"./each":2,"./emission_context":3,"./emit":4,"./log":6,"./slice":9}],6:[function(require,module,exports){
var log = [];

log.DEBUG = false;

log.logEvent = function(e, data) {
  var target;

  if (log.DEBUG) {
    target = e.target;

    return log.log('event', {
      type: e.type,
      class: e.toString(),
      target: log.target(e.target),
      emit: data
    });
  }
};

log.target = function(target) {
  return {
    tag: target.tagName,
    id: target.id,
    text: target.textContent
  }
};

log.log = function(type, data) {
  var entry;

  if (log.DEBUG) {
    entry = [ type, data ];
    
    log.push(entry);
    return entry;
  }
};

module.exports = log;

},{}],7:[function(require,module,exports){
var each = require('./each');
var log = require('./log');

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
      var inverted;

      if (match.slice(0, 1) === '!') {
        inverted = true;
        match = match.replace(/^!/, '')
      }

      each(emittedData, function(dataValue, dataKey) {
        if (watcherValue) return;
        if (match == dataKey) watcherValue = (inverted ? !dataValue : dataValue);
      });
    });

    if (watcherValue != undefined) {
      log.log('watcher', {
        watcher: watcher.name,
        argument: config[configKey],
        value: watcherValue,
        target: log.target(target),
        config: config
      });

      watcher(target, config[configKey], watcherValue, config);
    }
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
},{"./each":2,"./log":6}],8:[function(require,module,exports){
(function() {
  'use strict';
  var Okay, EmissionContext, listener, stack;

  window.Okay = Okay = {};
  if (!Okay) Okay = {};

  var Timer = require('./timer');
  var Emitter = require('./emitter');
  Okay.emit = require('./emit');
  Okay.watchers = require('./watchers');
  Okay.log = require('./log');
  Okay.timer = new Timer(Okay);

  Okay.emit.onEmit(function(state, elapsed) {
    Okay.log.log('state', { state: state, elapsed: elapsed });
  });

  Okay.eventListener = listener = function (e) {
    var emitter, timer;

    if (Okay.timer.running === true) timer = Okay.timer;
    emitter = Emitter.fromEvent(e, timer, Okay.watchers);
    emitter.call();
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
  Okay.timer.start();
}());

},{"./emit":4,"./emitter":5,"./log":6,"./timer":10,"./watchers":12}],9:[function(require,module,exports){
var arrayPrototypeSlice = Array.prototype.slice;

module.exports = function slice(object) {
  return arrayPrototypeSlice.apply(object);
};

},{}],10:[function(require,module,exports){
var each = require('./each');
var slice = require('./slice');

function Timer(Okay, clearEvery) {
  this.Okay = Okay;
  this.stack = [];
  this.running = false;
  this.clearEvery = clearEvery || 10;
}

Timer.prototype.start = function() {
  var timer = this;

  function clear() { timer.clear(); }
  timer.interval = window.setInterval(clear, timer.clearEvery);
  timer.running = true;
};

Timer.prototype.stop = function() {
  window.clearInterval(this.interval);
  this.running = false;
};

Timer.prototype.push = function(item) {
  this.stack.push(item);
};

Timer.prototype.clear = function() {
  var Okay = this.Okay;
  var computedState;

  computedState = Timer.getStateForTimer(this);
  if (computedState) Okay.emit(computedState, Okay.watchers);
};

Timer.getStateForTimer = function(timer) {
  var itemsToClear, computedState;

  itemsToClear = slice(timer.stack);
  timer.stack = [];

  if (itemsToClear.length == 0) return false;

  computedState  = {};
  each(itemsToClear, function(item) {
    each(item, function(val, key) {
      computedState[key] = val;
    });
  });

  return computedState;
};

module.exports = Timer;

},{"./each":2,"./slice":9}],11:[function(require,module,exports){
var transforms = {};

transforms['\\\[checked\\\]'] = function(target) {
  return target.checked;
};

transforms['!\\\[checked\\\]'] = function(target) {
  return !target.checked;
};

transforms['{value}'] = function(target, contextKey, context, template) {
  return template.replace(new RegExp('{value}', 'g'), target.value);
};

transforms['\\\[value\\\]'] = function(target, contextKey, context, template) {
  return target.value;
};

transforms['\\\[options\\\]'] = function(target, contextKey, context) {
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
},{}],12:[function(require,module,exports){
var dispatchDOMEvent = require('./dispatch-dom-event');

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
  var method = value ? 'add' : 'remove';
  target.classList[method](className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  var previousValue;
  if (attrName == 'value') previousValue = target.value;
  target.removeAttribute(attrName);
  if (value) target.setAttribute(attrName, value);

  if (attrName == 'checked') {
    target.checked = value;
    if ((target.checked && !value) || (!target.checked && value)) dispatchDOMEvent(target, 'change');
  }

  if (attrName == 'checked' || attrName == 'value') {
    if (previousValue.toString() != value.toString()) dispatchDOMEvent(target, 'change');
  }
};

exports.submit = function submitForm(target, attrName, value) {
  var cancelled;
  cancelled = dispatchDOMEvent(target, 'submit');
  if (!cancelled) target.submit();
};

},{"./dispatch-dom-event":1}]},{},[8]);
