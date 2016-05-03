var log = [];
var log = [];

log.DEBUG = false;

log.logEvent = function(e) {
  var logEntry;
  var data;

  if (log.DEBUG) {
    logEntry = ['event', e.type, e.toString()];
    logEntry.push([e.target.tagName, e.target.id, e.target.textContent]);

    try {
      data = JSON.parse(e.target.dataset.emit || e.currentTarget.dataset.emit);
      logEntry.push(data);
    } catch (e) {
    }

    log.push(logEntry);
  }
};

log.logState = function(data, stack, updateState) {
  var logEntry, started, ended, error;

  if (log.DEBUG) {
    started = +new Date();
    try {
      updateState();
    } catch (e) {
      error = e;
    }
    ended = +new Date();

    logEntry = ['state', data, ended - started, stack, error];
    log.push(logEntry);

    if (error) throw error;
  } else {
    updateState();
  }
};

module.exports = log;
