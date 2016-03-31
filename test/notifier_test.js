var Notifier = require('../src/notifier');
var assert = require('assert');

describe('Notifier', function() {
  function buildNotifier(name, watchData, emittedData) {
    var watcherCalled = false;
    var watcherCalls = [];

    var watcher = function() {
      watcherCalls.push([ this, arguments ]);
      watcherCalled = true;
    };

    var target = {
      getAttribute: function() {
        return JSON.stringify(watchData);
      }
    };
    notifier = new Notifier('class', watcher, target, emittedData);
    notifier.watcherCalled = function() { return watcherCalled; };
    notifier.watcherCalls = function() { return watcherCalls; };

    return notifier
  }

  it('hides when entree is null', function() {
    var watchData = {
      "entree[null],entree[fries]": "hidden"
    };

    var emittedData = {
      "entree[null]": true,
      "entree[burgers]": false,
      "entree[cheese]": false,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);

    notifier.update();
    assert.equal(notifier.watcherCalled(), true);
    assert.equal(notifier.watcherCalls().length, 1);
    assert.equal(notifier.watcherCalls()[0][1][1], 'hidden');
    assert.equal(notifier.watcherCalls()[0][1][2], true);
  });

  it('hides when entree is fries', function() {
    var watchData = {
      "entree[null],entree[fries]": "hidden"
    };

    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": false,
      "entree[cheese]": false,
      "entree[fries]": true,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);

    notifier.update();
    assert.equal(notifier.watcherCalled(), true);
    assert.equal(notifier.watcherCalls().length, 1);
    assert.equal(notifier.watcherCalls()[0][1][1], 'hidden');
    assert.equal(notifier.watcherCalls()[0][1][2], true);
  });

  it('shows when entree is burgers', function() {
    var watchData = {
      "entree[null],entree[fries]": "hidden"
    };

    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": true,
      "entree[cheese]": false,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);

    notifier.update();
    assert.equal(notifier.watcherCalled(), true);
    assert.equal(notifier.watcherCalls().length, 1);
    assert.equal(notifier.watcherCalls()[0][1][1], 'hidden');
    assert.equal(notifier.watcherCalls()[0][1][2], false);
  });

  it('shows when entree is cheese', function() {
    var watchData = {
      "entree[null],entree[fries]": "hidden"
    };

    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": false,
      "entree[cheese]": true,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);

    notifier.update();
    assert.equal(notifier.watcherCalled(), true);
    assert.equal(notifier.watcherCalls().length, 1);
    assert.equal(notifier.watcherCalls()[0][1][1], 'hidden');
    assert.equal(notifier.watcherCalls()[0][1][2], false);
  });
});
