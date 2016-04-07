var Notifier = require('../src/notifier');
var assert = require('assert');

describe('Notifier', function() {
  function fakeHTMLElement() {
    return { getAttribute: function() { return JSON.stringify(watchData); }};
  }

  var watchData = {
    "entree[null],entree[fries]": "hidden"
  };

  var assertWatcherSetHidden = function(notifier, bool) {
    var calls = notifier.watcherCalls();
    assert.equals(calls.length, 1);
    assert.equals(calls[0].hidden, bool);
  };

  function buildNotifier(name, watchData, emittedData) {
    var watcherCalls = [];

    var watcher = function(target, name, value, context) {
      data = {};
      data[name] = value;
      watcherCalls.push(data);
    };

    var target = fakeHTMLElement();
    notifier = new Notifier('class', watcher, target, emittedData);
    notifier.watcherCalled = function() { return watcherCalled; };
    notifier.watcherCalls = function() { return watcherCalls; };
    return notifier;
  }

  it('hides when entree is null', function() {
    var emittedData = {
      "entree[null]": true,
      "entree[burgers]": false,
      "entree[cheese]": false,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);
    notifier.update();
    assertWatcherSetHidden(notifier, true);
  });

  it('hides when entree is fries', function() {
    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": false,
      "entree[cheese]": false,
      "entree[fries]": true,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);
    notifier.update();
    assertWatcherSetHidden(notifier, true);
  });

  it('shows when entree is burgers', function() {
    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": true,
      "entree[cheese]": false,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);
    notifier.update();
    assertWatcherSetHidden(notifier, false);
  });

  it('shows when entree is cheese', function() {
    var emittedData = {
      "entree[null]": false,
      "entree[burgers]": false,
      "entree[cheese]": true,
      "entree[fries]": false,
      "entree": null
    };

    var notifier = buildNotifier('class', watchData, emittedData);
    notifier.update();
    assertWatcherSetHidden(notifier, false);
  });
});
