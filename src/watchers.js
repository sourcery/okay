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
  var event;
  target.removeAttribute(attrName);
  if (value) target.setAttribute(attrName, value);


  if (attrName == 'checked') {
    target.checked = value;
  }

  if (attrName == 'checked' || attrName == 'value') {
    event = new Event('change', { bubbles: true, cancelable: false });
    target.dispatchEvent(event);
  }
};

exports.submit = function submitForm(target, attrName, value) {
  target.submit();
};
