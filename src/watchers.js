exports.class = function applyClass(target, name, value) {
  target.classList.toggle(name, value);
};

exports.attr = function applyAttr(target, name, value) {
  target.setAttribute(name, value);
};

exports.html = function applyAttr(target, name, value, config) {
  if (config == 'append()') {
    target.innerHTML = target.innerHTML + value;
  } else if (config == 'prepend()') {
    target.innerHTML = value + target.innerHTML;
  } else {
    target.innerHTML = value;
  }
};
