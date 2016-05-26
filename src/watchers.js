var each = require('./each');
var dispatchDOMEvent = require('./dispatch-dom-event');
var sendXhr = require('./send-xhr');

exports.html = function applyHTML(target, setting, value, config) {
  if (setting == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (setting == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};

exports.class = function applyClass(target, className, value) {
  var method = value ? 'add' : 'remove';
  target.classList[method](className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  var previousValue;
  if (attrName == 'value') previousValue = target.value;
  target.removeAttribute(attrName);
  if (value) target.setAttribute(attrName, value);

  if (attrName == 'checked') {
    target.checked = value;
    if ((target.checked && !value) || (!target.checked && value)) dispatchDOMEvent(target, 'change');
  }

  if (attrName == 'checked' || attrName == 'value') {
    if (previousValue.toString() != value.toString()) dispatchDOMEvent(target, 'change');
  }
};

exports.submit = function submitForm(target, watcherSetting, emitterSetting, watcherConfig, watcherKey) {
  var shouldSubmitForm, shouldSubmitWithXhr, data;

  shouldSubmitForm = watcherSetting === emitterSetting;
  shouldSubmitWithXhr = watcherSetting === 'xhr';

  if (!shouldSubmitForm && !shouldSubmitWithXhr) return;

  shouldSubmitForm = !dispatchDOMEvent(target, 'submit');

  if (shouldSubmitWithXhr) {
    shouldSubmitForm = false;

    data = {};
    data[watcherKey+'.request.started'] = true;
    Okay.application.performWatchers([data]);

    sendXhr(target, function(e, xhr) {
      data = {};
      data[watcherKey+'.response'] = xhr.responseText;
      data[watcherKey+'.response.'+xhr.status] = xhr.responseText;
      data[watcherKey+'.response.status'] = xhr.status;
      data[watcherKey+'.response.success'] = xhr.status.toString()[0] == '2';
      Okay.application.performWatchers([data])
    });
  }

  if (shouldSubmitForm) target.submit();
};
