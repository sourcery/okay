var rewire = require('rewire');
var GetDataFromEvent = rewire('../src/get-data-from-event');
var assert = require('assert');

describe('GetDataFromEvent', function() {
  var document;

  function makeTarget(type) {
    var target = {};

    if (type === 'filter' || type === 'dataset' || type === 'emits' || type === 'document') target.dataset = {};
    if (type === 'filter' || type === 'emits' || type === 'document') target.dataset.emit = '{"some":"json","dynamic":"[value]"}';
    if (type === 'document') { document = target }
    if (type === 'filter') { target.dataset.emitEvent = '{"type":"keyup"}' }

    target.value = 'super value';

    return target;
  }

  function makeEvent(targetSetting, currentTargetSetting, pathSetting1, pathSetting2, eventType) {
    if (!eventType) eventType = 'change';

    return {
      target: makeTarget(targetSetting),
      currentTarget: makeTarget(currentTargetSetting),
      type: eventType,
      path: [
        makeTarget(pathSetting1),
        makeTarget(pathSetting2)
      ]
    };
  }

  before(function() {
    GetDataFromEvent.__set__('document', document);
  });

  it('instantiates an GetDataFromEvent', function() {
    var event, result;
    event = makeEvent('emits', 'emits', 'emits', 'emits');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, event.target);
    assert.deepEqual(result.data, { some: 'json', dynamic: 'super value' });
  });

  it('traverse the event path', function() {
    var event, result;
    event = makeEvent('none', 'dataset', 'none', 'emits');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, event.path[1]);
    assert.deepEqual(result.data, { some: 'json', dynamic: 'super value' });
  });

  it('will use current target', function() {
    var event, result;
    event = makeEvent('none', 'emits', 'emits', 'emits');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, event.currentTarget);
    assert.deepEqual(result.data, { some: 'json', dynamic: 'super value' });
  });

  it('skips if event type does not match the event configuration of the target', function() {
    var event, result;
    event = makeEvent('none', 'filter', 'filter', 'filter', 'change');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, undefined);
    assert.deepEqual(result.data, undefined);
  });

  it('uses the first target that matches the event configuration of the target', function() {
    var event, result;
    event = makeEvent('none', 'none', 'filter', 'emits', 'keyup');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, event.path[0]);
    assert.deepEqual(result.data, { some: 'json', dynamic: 'super value' });
  });

  it('skips the document', function() {
    var event, result;
    event = makeEvent('none', 'document', 'emits', 'emits');
    result = GetDataFromEvent.perform({ event: event });
    assert.equal(result.target, event.currentTarget);
    assert.deepEqual(result.data, { some: 'json', dynamic: 'super value' });
  });
});
