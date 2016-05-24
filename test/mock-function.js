var slice = require('../src/slice');

function mockFunction(stub) {
  var calls, mock;
  calls = [];
  mock = function() {
    var currentCall;

    currentCall = {
      this: this,
      arguments: slice(arguments)
    };
    calls.push(currentCall);

    if (typeof stub == 'function') {
      currentCall.returnValue = stub.call(this, arguments);
    } else if (stub) {
      currentCall.returnValue = stub
    }

    return currentCall.returnValue;
  };

  mock.calls = calls;
  mock.reset = function() {
    calls = [];
  };
  return mock;
};

module.exports = mockFunction;