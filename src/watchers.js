exports.class = function applyClass(target, name, value) {
  target.classList.toggle(name, value);
};

exports.attr = function applyAttr(target, name, value) {
  target.setAttribute(name, value);
};
