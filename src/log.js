var log = [];

log.logEvent = function(e) {
  var logEntry;
  logEntry= [ e.type, e.toString() ];
  logEntry.push([ e.target.tagName, e.target.id, e.target.textContent ]);

  var data;
  try {
    data = JSON.parse(e.target.dataset.emit || e.currentTarget.dataset.emit);
    logEntry.push(data);
  } catch (e) {}

  log.push(logEntry);
};

module.exports = log;