var rewire = require('rewire');
var Application = rewire('../src/application');
var adapter = rewire('../src/base');
var Timer = require('../src/timer');
var assert = require('assert');
var mockFunction = require('./mock-function');

describe('Application', function() {
  var document, window, application, GetDataFromEvent, AcquireTargetsForWatcher, PerformWatcher;

  function fakeEventTarget() {
    return {
      addEventListener: mockFunction(),
      removeEventListener: mockFunction()
    }
  };

  beforeEach(function() {
    document = fakeEventTarget();
    window = fakeEventTarget();

    GetDataFromEvent = {
      perform: mockFunction({ data: 'real good data' })
    };

    AcquireTargetsForWatcher = mockFunction([ 'target1', 'target2' ]);
    PerformWatcher = mockFunction();

    adapter.__set__('document', document);
    adapter.__set__('window', window);
    Application.__set__('window', window);
    Application.__set__('GetDataFromEvent', GetDataFromEvent);
    Application.__set__('AcquireTargetsForWatcher', AcquireTargetsForWatcher);
    Application.__set__('PerformWatcher', PerformWatcher);
    application = new Application(adapter);
  });

  describe('#initialize', function() {
    it('initializes a timer', function() {
      assert.equal(application.timer.constructor, Timer);
      assert.equal(application.timer.running, false);
    });

    it('initializes a defines application.listener', function() {
      var event = 'fake event';
      assert.equal(typeof application.listener, 'function');

      application.processEvent = mockFunction();
      application.listener(event);
      assert.equal(application.processEvent.calls[0].this, application);
      assert.equal(application.processEvent.calls[0].arguments[0], event);
    });
  });

  describe('#processEvent', function() {
    var timer;

    beforeEach(function() {
      timer = {
        running: true,
        push: mockFunction()
      };

      application.timer = timer;
      application.performWatchers = mockFunction();
    });

    describe('when the timer is running', function() {
      it('gets the data from the event and passes it to the timer', function() {
        application.processEvent('event');

        assert.equal(GetDataFromEvent.perform.calls.length, 1);
        assert.equal(GetDataFromEvent.perform.calls[0].arguments[0].event, 'event');

        assert.equal(timer.push.calls.length, 1);
        assert.equal(timer.push.calls[0].arguments[0], 'real good data');
      });
    })

    describe('when the timer is not running', function() {
      it('gets the data from the event and performs watchers directly', function() {
        timer.running = false;

        application.processEvent('event');

        assert.equal(GetDataFromEvent.perform.calls.length, 1);
        assert.equal(GetDataFromEvent.perform.calls[0].arguments[0].event, 'event');

        assert.equal(application.performWatchers.calls.length, 1);
        assert.equal(application.performWatchers.calls[0].arguments[0], 'real good data');
      });
    })
  });

  describe('#performWatchers', function() {
    beforeEach(function() {
      application.watchers = {
        first: 'do first watcher',
        second: 'do second watcher'
      }
    });

    it('cycles through watchers, finding targets and performing watchers on the targets', function() {
      application.performWatchers([ { my: 'good' }, { data: 'set' } ]);

      //assert.ok(AcquireTargetsForWatcher.calls.length, 2);
      assert.deepEqual(AcquireTargetsForWatcher.calls[0].arguments[0], 'first');
      assert.deepEqual(AcquireTargetsForWatcher.calls[1].arguments[0], 'second');

      assert.deepEqual(PerformWatcher.calls.length, 4);
      assert.deepEqual(PerformWatcher.calls[0].arguments, [ 'first', 'do first watcher', 'target1', { my: 'good', data: 'set' } ]);
      assert.deepEqual(PerformWatcher.calls[1].arguments, [ 'first', 'do first watcher', 'target2', { my: 'good', data: 'set' } ]);
      assert.deepEqual(PerformWatcher.calls[2].arguments, [ 'second', 'do second watcher', 'target1', { my: 'good', data: 'set' } ]);
      assert.deepEqual(PerformWatcher.calls[3].arguments, [ 'second', 'do second watcher', 'target2', { my: 'good', data: 'set' } ]);
    });
  });

  describe('#setEventListeners', function() {
    function assertAddedEventListeners(target) {
      var addEventListenerCalls = target.addEventListener.calls;
      assert.equal(addEventListenerCalls.length, 3);
      assert.equal(addEventListenerCalls[0].arguments[0], 'change');
      assert.equal(addEventListenerCalls[0].arguments[1], application.listener);
      assert.equal(addEventListenerCalls[1].arguments[0], 'click');
      assert.equal(addEventListenerCalls[1].arguments[1], application.listener);
      assert.equal(addEventListenerCalls[2].arguments[0], 'keyup');
      assert.equal(addEventListenerCalls[2].arguments[1], application.listener);
    }
    it('adds event listeners to document and window', function() {
      assertAddedEventListeners(document);
      assertAddedEventListeners(window);
    });
  });

  describe('#clearEventListeners', function() {
    function assertClearedEventListeners(target) {
      var removeEventListenerCalls = target.removeEventListener.calls;
      assert.equal(removeEventListenerCalls.length, 3);
      assert.equal(removeEventListenerCalls[0].arguments[0], 'change');
      assert.equal(removeEventListenerCalls[0].arguments[1], application.listener);
      assert.equal(removeEventListenerCalls[1].arguments[0], 'click');
      assert.equal(removeEventListenerCalls[1].arguments[1], application.listener);
      assert.equal(removeEventListenerCalls[2].arguments[0], 'keyup');
      assert.equal(removeEventListenerCalls[2].arguments[1], application.listener);
    }
    it('removes event listeners to document and window', function() {
      application.adapter.clearEventListeners(application);
      assertClearedEventListeners(document);
      assertClearedEventListeners(window);
    });
  });
});