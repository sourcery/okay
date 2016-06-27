Base = {};
Base.watchers = {};

function setEventListeners(target, listener, addListeners) {
  var functionName;
  functionName = 'addEventListener';
  if (addListeners === false) functionName = 'removeEventListener';
  target[functionName]('change', listener);
  target[functionName]('click', listener);
  target[functionName]('keyup', listener);
}

Base.setEventListeners = function(application) {
  var listener = application.listener;
  setEventListeners(window, listener);
  setEventListeners(document, listener);
};

Base.clearEventListeners = function(application) {
  var listener = application.listener;
  setEventListeners(window, listener, false);
  setEventListeners(document, listener, false);
};

module.exports = Base;
