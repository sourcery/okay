var log = [];

log.logEvent = function(e) {
  var logEntry;
  logEntry= [ 'event', e.type, e.toString() ];
  logEntry.push([ e.target.tagName, e.target.id, e.target.textContent ]);

  var data;
  try {
    data = JSON.parse(e.target.dataset.emit || e.currentTarget.dataset.emit);
    logEntry.push(data);
  } catch (e) {}

  log.push(logEntry);
};

log.logState = function(data, stack, updateState) {
  var logEntry, started, ended, error;

  started = +new Date();
  try {
    updateState();
  } catch (e) { error = e; }
  ended = +new Date();

  logEntry= [ 'state', data, ended - started, stack, error ];
  log.push(logEntry);

  if (error) throw error;
};

module.exports = log;