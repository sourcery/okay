var rewire = require('rewire');
var Emitter = rewire('../src/emitter');
var assert = require('assert');

describe('Emitter', function() {
  describe('.fromEvent', function() {
    var document;

    function makeTarget(type) {
      var target = {};

      if (type === 'dataset' || type === 'emits' || type === 'document') target.dataset = {};
      if (type === 'emits' || type === 'document') target.dataset.emit = '{"some":"json"}';
      if (type === 'document') { document = target }

      return target;
    }

    function makeEvent(targetSetting, currentTargetSetting, pathSetting1, pathSetting2) {
      return {
        target: makeTarget(targetSetting),
        currentTarget: makeTarget(currentTargetSetting),
        path: [
          makeTarget(pathSetting1),
          makeTarget(pathSetting2)
        ]
      };
    }

    before(function() {
      Emitter.__set__('document', document);
      Emitter.__set__('EmissionContext', function() {
        return {
          context: function() { return 'EmissionContext.context' }
        }
      });
    });

    it('instantiates an Emitter', function() {
      var event, emitter;
      event = makeEvent('emits', 'emits', 'emits', 'emits');
      emitter = Emitter.fromEvent(event, 'timer', 'watchers');
      assert.equal(emitter.target, event.target);
      assert.equal(emitter.data, 'EmissionContext.context');
      assert.equal(emitter.timer, 'timer');
      assert.equal(emitter.watchers, 'watchers');
    });

    it('traverse the event path', function() {
      var event, emitter;
      event = makeEvent('none', 'dataset', 'none', 'emits');
      emitter = Emitter.fromEvent(event, 'timer', 'watchers');
      assert.equal(emitter.target, event.path[1]);
      assert.equal(emitter.data, 'EmissionContext.context');
      assert.equal(emitter.timer, 'timer');
      assert.equal(emitter.watchers, 'watchers');
    });

    it('will use current target', function() {
      var event, emitter;
      event = makeEvent('none', 'emits', 'emits', 'emits');
      emitter = Emitter.fromEvent(event, 'timer', 'watchers');
      assert.equal(emitter.target, event.currentTarget);
      assert.equal(emitter.data, 'EmissionContext.context');
      assert.equal(emitter.timer, 'timer');
      assert.equal(emitter.watchers, 'watchers');
    });

    it('skips the document', function() {
      var event, emitter;
      event = makeEvent('none', 'document', 'emits', 'emits');
      emitter = Emitter.fromEvent(event, 'timer', 'watchers');
      assert.equal(emitter.target, event.currentTarget);
      assert.equal(emitter.data, 'EmissionContext.context');
      assert.equal(emitter.timer, 'timer');
      assert.equal(emitter.watchers, 'watchers');
    });
  });

  describe('#call', function() {
    var emitCalls, data, timer;

    beforeEach(function() {
      data = { amazing: 'data' };
      timer = [];
      emitCalls = [];

      Emitter.__set__('emit', function(data, watchers) {
        emitCalls.push({
          data: data,
          watchers: watchers
        });
      });
    });

    it('defaults to calling emit directly', function() {
      var emitter;

      emitter = new Emitter('target', data, undefined, 'watchers');
      emitter.call();
      assert.equal(timer.length, 0);
      assert.equal(emitCalls[0].data, data);
      assert.equal(emitCalls[0].watchers, 'watchers');
    });

    it('uses the timer if there is one', function() {
      var emitter;

      emitter = new Emitter('target', data, timer, 'watchers');
      emitter.call();
      assert.equal(timer[0], data);
      console.log(emitCalls);
      assert.equal(emitCalls.length, 0);
    });
  });
});
