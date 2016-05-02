var rewire = require('rewire');
var emit = rewire('../src/emit');
var assert = require('assert');

describe('emit', function() {
  it('dispatches data', function() {
    var dispatches;
    var fakeHtml;
    var fakeClass;
    var data;

    dispatches = [];
    function fakeDispatch(watcherName, watcher, emittedData) {
      dispatches.push([watcherName, watcher, emittedData])
    }

    emit.__set__('Notifier', {
      dispatch: fakeDispatch
    });

    fakeHtml = 'fake html';
    fakeClass = 'fake class';

    var watchers = {
      html: fakeHtml,
      class: fakeClass
    };

    data = { booger: 'stein' };
    emit(data, watchers);

    assert.equal(dispatches[1][0], 'class');
    assert.equal(dispatches[1][1], 'fake class');
    assert.equal(dispatches[1][2], data);

    assert.equal(dispatches[0][0], 'html');
    assert.equal(dispatches[0][1], 'fake html');
    assert.equal(dispatches[0][2], data);
  });
});
