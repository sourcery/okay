(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/interactor').perform;

},{"./lib/interactor":3}],2:[function(require,module,exports){
function Context(hash) {
  var i;
  for (i in hash) {
    if (hash.hasOwnProperty(i)) this[i] = hash[i];
  }
}

Context.prototype.fail = function(message) {
  if (message) this.message = message;
  this.status = 'failed';
  throw 'interactor raised'
}

Context.prototype.succeed = function(message) {
  if (message) this.message = message;
  this.status = 'succeeded';
  throw 'interactor raised'
}

Context.prototype.skip = function() {
  throw 'interactor raised'
}

module.exports = Context;

},{}],3:[function(require,module,exports){
var Context;

Context = require('./context');

function performOrganizer(organizer, context) {
  var i, ii, currentInteractor;

  interactors = organizer.organize;

  for (i = 0, ii = interactors.length; i < ii; i ++) {
    currentInteractor = interactors[i];
    performInteractor(currentInteractor, context);
    if (context.status === 'failed' || context.status === 'succeeded') break;
  }
}

function performInteractor(interactorClass, context) {
  interactor = new interactorClass();
  interactor.context = context;
  interactor.succeed = succeed;
  interactor.fail = fail;
  interactor.skip = skip;
  try { interactor.perform(); }
  catch (e) { if (e !== 'interactor raised') throw e; }
}

function succeed(message) {
  this.context.succeed(message);
}

function fail(message) {
  this.context.fail(message);
}

function skip() {
  this.context.skip();
}

function perform(hash) {
  var context, interactor;

  context = new Context(hash);
  interactor = this;

  if (interactor.organize) performOrganizer(interactor, context);
  else performInteractor(interactor, context);

  return context;
}

exports.perform = perform;

},{"./context":2}],4:[function(require,module,exports){
var perform = require('node-interactor');
var slice = require('./slice');
var each = require('./each');
function AcquireTargetsForWatcher() {}
module.exports = AcquireTargetsForWatcher;
AcquireTargetsForWatcher.perform = perform;

AcquireTargetsForWatcher.prototype.perform = function() {
  var name = this.context.name;
  this.context.targets = slice(document.querySelectorAll('[data-watch-'+name+']'));
};

},{"./each":11,"./slice":18,"node-interactor":1}],5:[function(require,module,exports){
var each = require('./each');
var count = require('./count');
var benchmark = require('./benchmark');
var Timer = require('./timer');
var mergeToHash = require('./merge-to-hash');
var GetDataFromEvent = require('./get-data-from-event');
var AcquireTargetsForWatcher = require('./acquire-targets-for-watcher');
var PerformWatcherOnTarget = require('./perform-watcher-on-target');
var defaultWatchers = require('./watchers');
var log = require('./log');

function Application(adapter) {
  var application = this;

  this.timer = new Timer(this, 'performWatchers');

  this.listener = function(e) {
    application.processEvent(e);
  };

  this.setAdapter(adapter);
}

Application.prototype.processEvent = function(e) {
  var app, timer, result, data;

  app = this;
  timer = app.timer;

  result = GetDataFromEvent.perform({
    event: e
  });
  data = result.data;

  if (timer.running === true) timer.push(data);
  else app.performWatchers([data]);
};

Application.prototype.performWatchers = function(data) {
  var watchers, emittedData;

  emittedData = mergeToHash(data);
  watchers = this.watchers;

  each(watchers, function (watcher, watcherName) {
    var result, targets, elapsed;

    result = AcquireTargetsForWatcher.perform({
      name: watcherName
    });

    targets = result.targets;

    elapsed = benchmark(function () {
      each(targets, function (target) {
        PerformWatcherOnTarget.perform({
          name: watcherName,
          watcher: watcher,
          target: target,
          emittedData: emittedData
        });
      });
    });

    if (count(emittedData) > 0) {
      log.log('state', {
        state: emittedData,
        elapsed: elapsed
      });
    }
  });
};

Application.prototype.setAdapter = function(adapter) {
  if (this.adapter) this.adapter.clearEventListeners(this);
  this.adapter = adapter;
  this.adapter.setEventListeners(this);
  this.watchers = mergeToHash([ defaultWatchers, this.adapter.watchers ]);
};

module.exports = Application;

},{"./acquire-targets-for-watcher":4,"./benchmark":8,"./count":9,"./each":11,"./get-data-from-event":12,"./log":13,"./merge-to-hash":14,"./perform-watcher-on-target":17,"./timer":19,"./watchers":21}],6:[function(require,module,exports){
var each = require('./each');
var transforms = require('./transforms');
var perform = require('node-interactor');
function ApplyTransforms() {}
module.exports = ApplyTransforms;
ApplyTransforms.perform = perform;

// ---

ApplyTransforms.prototype.perform = function() {
  rawData = this.context.rawData;
  target = this.context.target;
  data = {};

  each(rawData, function(dataValue, dataKey) {
    each(transforms, function(transform, transformName) {
      if (new RegExp(transformName).test(dataValue)) {
        data[dataKey] = transform(target, dataKey, data, dataValue);
      }
    });

    if (data[dataKey] == undefined) data[dataKey] = rawData[dataKey];
  });

  this.context.data = data;
};

},{"./each":11,"./transforms":20,"node-interactor":1}],7:[function(require,module,exports){
Base = {};
Base.watchers = {};

Base.setEventListeners = function(application) {
  var listener = application.listener;
  window.addEventListener('change', listener);
  window.addEventListener('click', listener);
  document.addEventListener('change', listener);
  document.addEventListener('click', listener);
};

Base.clearEventListeners = function(application) {
  var listener = application.listener;
  window.removeEventListener('change', listener);
  window.removeEventListener('click', listener);
  document.removeEventListener('change', listener);
  document.removeEventListener('click', listener);
};

module.exports = Base;

},{}],8:[function(require,module,exports){
function benchmark(subject) {
  var started, finished;

  started = +new Date();
  subject();
  finished = +new Date();
  return finished - started;
}

module.exports = benchmark;
},{}],9:[function(require,module,exports){
var each = require('./each');

function count(object) {
  var i = 0;
  each(object, function() { i++; });
  return i;
}

module.exports = count;
},{"./each":11}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
function each(collection, callback) {
  for (var i in collection) {
    callback(collection[i], i);
  }
};

module.exports = each;

},{}],12:[function(require,module,exports){
var perform = require('node-interactor');
var slice = require('./slice');
var each = require('./each');
var log = require('./log');
var ApplyTransforms = require('./apply-transforms');
function GetDataFromEvent() {}
module.exports = GetDataFromEvent;
GetDataFromEvent.perform = perform;

// ---

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

GetDataFromEvent.prototype.perform = function() {
  var event, target, json, rawData, data;
  event = this.context.event;
  target = determineTarget(event);

  if (target) {
    json = target.dataset.emit;
    rawData = typeof json === 'string' ? JSON.parse(json) : json;
    log.logEvent(event, rawData);
    result = ApplyTransforms.perform({
      target: target,
      rawData: rawData
    });
    data = result.data;
  }

  this.context.target = target;
  this.context.data = data;
};

},{"./apply-transforms":6,"./each":11,"./log":13,"./slice":18,"node-interactor":1}],13:[function(require,module,exports){
var log = [];
log.byType = {};

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
    if (log.byType[type] == undefined) log.byType[type] = [];
    log.byType[type].push(entry);
    console.log("[ okay ]\n\n"+type+"\n\n"+JSON.stringify(data)+"\n\n");
    return entry;
  }
};

module.exports = log;

},{}],14:[function(require,module,exports){
var each = require('./each');

function mergeToHash(items) {
  var result;

  result  = {};

  each(items, function(item) {
    each(item, function(val, key) {
      result[key] = val;
    });
  });

  return result
}

module.exports = mergeToHash;
},{"./each":11}],15:[function(require,module,exports){
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

module.exports = Notifier;
},{"./each":11,"./log":13}],16:[function(require,module,exports){
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

},{"./application":5,"./base":7,"./log":13,"./watchers":21}],17:[function(require,module,exports){
var perform = require('node-interactor');
var slice = require('./slice');
var each = require('./each');
var Notifier = require('./notifier');
function PerformWatcherOnTarget() {}
module.exports = PerformWatcherOnTarget;
PerformWatcherOnTarget.perform = perform;

PerformWatcherOnTarget.prototype.perform = function() {
  var name = this.context.name;
  var watcher = this.context.watcher;
  var target = this.context.target;
  var emittedData = this.context.emittedData;
  var notifier = new Notifier(name, watcher, target, emittedData);
  notifier.update();
};

},{"./each":11,"./notifier":15,"./slice":18,"node-interactor":1}],18:[function(require,module,exports){
var arrayPrototypeSlice = Array.prototype.slice;

module.exports = function slice(object) {
  return arrayPrototypeSlice.apply(object);
};

},{}],19:[function(require,module,exports){
var each = require('./each');
var slice = require('./slice');

function Timer(delegate, message, clearEvery) {
  this.delegate = delegate;
  this.message = message;
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
  var delegate, message, itemsToClear;

  delegate = this.delegate;
  message = this.message;
  itemsToClear = slice(this.stack);
  this.stack = [];
  delegate[message].call(delegate, itemsToClear);
};

module.exports = Timer;

},{"./each":11,"./slice":18}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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

},{"./dispatch-dom-event":10}]},{},[16]);
