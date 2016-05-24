Base = {};
Base.watchers = {};

Base.setEventListeners = function(application) {
  var listener = application.listener;
  window.addEventListener('change', listener);
  window.addEventListener('click', listener);
  document.addEventListener('change', listener);
  document.addEventListener('click', listener);
};

Base.clearEventListeners = function(application) {
  var listener = application.listener;
  window.removeEventListener('change', listener);
  window.removeEventListener('click', listener);
  document.removeEventListener('change', listener);
  document.removeEventListener('click', listener);
};

module.exports = Base;
