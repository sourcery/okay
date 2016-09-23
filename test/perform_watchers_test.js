var PerformWatcher = require('../src/perform-watcher');
var assert = require('assert');

describe('PerformWatcher', function() {
  var watchData;

  function fakeHTMLElement() {
    return { textContent: "element text content", getAttribute: function() { return JSON.stringify(watchData); }};
  }

  var assertWatcherSetHidden = function(result, bool) {
    var calls = result.watcherCalls();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].hidden, bool);
  };

  function buildPerformWatcher(name, watchData, emittedData) {
    var watcher, result, target, watcherCalls = [];

    var watcher = function(target, name, value, context) {
      data = {};
      data[name] = value;
      watcherCalls.push(data);
    };

    target = fakeHTMLElement();
    PerformWatcher('class', watcher, target, emittedData);
    result = {};
    result.watcherCalled = function() { return watcherCalled; };
    result.watcherCalls = function() { return watcherCalls; };
    return result;
  }

  it('handles basic scenario', function() {
    watchData = {
      "active": "hidden"
    };

    var emittedData = {
      "active": true
    };

    var result = buildPerformWatcher('class', watchData, emittedData);
    assertWatcherSetHidden(result, true);
  });

  describe('inverting watchers', function() {
    it('inverts keys starting with !', function() {
      watchData = {
        "!active": "hidden"
      };

      var emittedData = {
        "active": false
      };

      var result = buildPerformWatcher('class', watchData, emittedData);
      assertWatcherSetHidden(result, true);
    });
  });

  describe('comma separated watchers', function() {
    it('hides when entree is null', function() {
      watchData = {
        "entree[null],entree[fries]": "hidden"
      };

      var emittedData = {
        "entree[null]": true,
        "entree[burgers]": false,
        "entree[cheese]": false,
        "entree[fries]": false,
        "entree": null
      };

      var result = buildPerformWatcher('class', watchData, emittedData);
      assertWatcherSetHidden(result, true);
    });

    it('hides when entree is fries', function() {
      var emittedData = {
        "entree[null]": false,
        "entree[burgers]": false,
        "entree[cheese]": false,
        "entree[fries]": true,
        "entree": null
      };

      var result = buildPerformWatcher('class', watchData, emittedData);
      assertWatcherSetHidden(result, true);
    });

    it('shows when entree is burgers', function() {
      var emittedData = {
        "entree[null]": false,
        "entree[burgers]": true,
        "entree[cheese]": false,
        "entree[fries]": false,
        "entree": null
      };

      var result = buildPerformWatcher('class', watchData, emittedData);
      assertWatcherSetHidden(result, false);
    });

    it('shows when entree is cheese', function() {
      var emittedData = {
        "entree[null]": false,
        "entree[burgers]": false,
        "entree[cheese]": true,
        "entree[fries]": false,
        "entree": null
      };

      var result = buildPerformWatcher('class', watchData, emittedData);
      assertWatcherSetHidden(result, false);
    });
  });
});
