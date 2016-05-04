var log = [];

log.DEBUG = false;

log.logEvent = function(e, data) {
  var target;

  if (log.DEBUG) {
    target = e.target;

    return log.log('event', {
      type: e.type,
      class: e.toString(),
      target: {
        tag: target.tagName,
        id: target.id,
        text: target.textContent
      },
      emit: data
    });
  }
};

log.log = function(type, data) {
  var entry;

  if (log.DEBUG) {
    entry = [ type, data ];
    
    log.push(entry);
    return entry;
  }
};

module.exports = log;
