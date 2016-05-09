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