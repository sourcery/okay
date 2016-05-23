var eventMap = {
  submit: 'Events',
  change: 'HTMLEvents'
};

function dispatchDOMEvent(target, type) {
  var event, cancelled;

  if ("createEvent" in document) {
    event = document.createEvent(eventMap[type]);
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
    cancelled = event.defaultPrevented || event.cancelBubble;
  } else {
    cancelled = target.fireEvent("on"+type);
  }

  return cancelled;
}

module.exports = dispatchDOMEvent;