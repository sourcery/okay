var log = [];

log.DEBUG = false;

log.logEvent = function(e, data) {
  var target;

  if (log.DEBUG) {
    target = e.target;

    return log.log('event', {
      type: e.type,
      class: e.toString(),
      target: log.target(e.target),
      emit: data
    });
  }
};

log.target = function(target) {
  return {
    tag: target.tagName,
    id: target.id,
    text: target.textContent
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
