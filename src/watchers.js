exports.class = function applyClass(target, className, value) {
  target.classList.toggle(className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  target.removeAttribute(attrName);
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
