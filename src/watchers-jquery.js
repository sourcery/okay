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
  $(target).toggleClass(className, value);
};

exports.attr = function applyAttr(target, attrName, value) {
  $(target).removeProp(attrName);
  if (value) $(target).prop(attrName, value);

  if (attrName == 'checked') {
    target.checked = value;
    setTimeout(function () { $(target).trigger('change'); });
  }

  if (attrName == 'checked' || attrName == 'value') {
    setTimeout(function () { $(target).trigger('change'); });
  }
};
