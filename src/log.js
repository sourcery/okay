var log = [];
log.byType = {};

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
  var textContent, textContentLength, concatenatedContent;
  textContent = target.textContent;
  textContentLength = textContent.length;

  if (textContentLength > 1000) {
    concatenatedContent = [ textContent.substr(0, 500), textContent.substr(textContentLength - 500) ].join('...')
  } else {
    concatenatedContent = textContent;
  }

  return {
    tag: target.tagName,
    id: target.id,
    text: concatenatedContent
  }
};

log.log = function(type, data) {
  var entry;

  if (log.DEBUG) {
    entry = [ type, data ];
    
    log.push(entry);
    if (log.byType[type] == undefined) log.byType[type] = [];
    log.byType[type].push(entry);
    console.log("[ okay ]\n\n"+type+"\n\n"+JSON.stringify(data)+"\n\n");
    return entry;
  }
};

module.exports = log;
