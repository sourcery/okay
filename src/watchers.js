exports.class = function applyClass(target, className, value) {
  var method = value ? 'add' : 'remove';
  target.classList[method](className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  target.removeAttribute(attrName);

  if (attrName == 'checked') {
    target.checked = value;
    event = new Event('change', { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
  }

  if (value) target.setAttribute(attrName, value);
};

exports.html = function applyHTML(target, setting, value, config) {
  if (setting == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (setting == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};
