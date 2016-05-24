var rewire = require('rewire');
var AcquireTargetsForWatcher = rewire('../src/acquire-targets-for-watcher');
var assert = require('assert');
var mockFunction = require('./mock-function');

describe('AcquireTargetsForWatcher', function() {
  it('queries the document for elements with data attribute "data-watch-sausage"', function() {
    var document, result;

    document = {
      querySelectorAll: mockFunction([ 'target1', 'target2' ])
    };

    AcquireTargetsForWatcher.__set__('document', document);
    result = AcquireTargetsForWatcher.perform({ name: 'sausage' });

    assert.equal(document.querySelectorAll.calls.length, 1);
    assert.equal(document.querySelectorAll.calls[0].arguments[0], '[data-watch-sausage]');
    assert.deepEqual(result.targets, [ 'target1', 'target2' ]);
  });
});