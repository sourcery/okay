var transforms = {};

transforms['\\\[checked\\\]'] = function(target) {
  return target.checked;
};

transforms['!\\\[checked\\\]'] = function(target) {
  return !target.checked;
};

transforms['{value}'] = function(target, contextKey, context, template) {
  if (target.value !== undefined) return template.replace(new RegExp('{value}', 'g'), target.value);
  else return ''
};

transforms['\\\[value\\\]'] = function(target, contextKey, context, template) {
  if (target.value !== undefined) return target.value;
  else return '';
};

transforms['\\\[options\\\]'] = function(target, contextKey, context) {
  var selectedOptionValue;
  var options = target.children;

  function updateContextForOption(option) {
    var selected, value;
    selected = option.selected == true;
    value = option.getAttribute('value');
    context[contextKey+'['+value+']'] = selected;
    if (selected) selectedOptionValue = value;
  }

  for (var i = 0, ii = options.length; i < ii; i++) {
    updateContextForOption(options[i]);
  }

  return selectedOptionValue;
};

module.exports = transforms;