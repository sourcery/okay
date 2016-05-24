var rewire = require('rewire');
var PerformWatcherOnTarget = rewire('../src/acquire-targets-for-watcher');
var assert = require('assert');
var mockFunction = require('./mock-function');

describe('PerformWatcherOnTarget', function() {
  it('queries the document for elements with data attribute "data-watch-sausage"', function() {
    var document, result;

    document = {
      querySelectorAll: mockFunction([ 'target1', 'target2' ])
    };

    PerformWatcherOnTarget.__set__('document', document);
    result = PerformWatcherOnTarget.perform({ name: 'sausage' });

    assert.deepEqual(result.targets, [ 'target1', 'target2' ]);
  });
});
