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
  var target, possibleTargets, eventType;

  eventType = e.type;

  possibleTargets = e.path ? slice(e.path) : [];
  if (e.currentTarget != document) possibleTargets.unshift(e.currentTarget);
  possibleTargets.unshift(e.target);

  each(possibleTargets, function (eachTarget) {
    var dataset, eventFilter;
    if (!target && eachTarget && (dataset = eachTarget.dataset) && dataset.emit) {
      if (dataset.emitEvent) eventFilter = JSON.parse(dataset.emitEvent);
      if ((!eventFilter && (eventType === 'change' || eventType === 'click')) || (eventFilter && eventFilter.type === eventType)) {
        target = eachTarget;
      }
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
