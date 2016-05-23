var transforms = {};

transforms['\\\[checked\\\]'] = function(target) {
  return target.checked;
};

transforms['!\\\[checked\\\]'] = function(target) {
  return !target.checked;
};

transforms['{value}'] = function(target, contextKey, context, template) {
  return template.replace(new RegExp('{value}', 'g'), target.value);
};

transforms['\\\[value\\\]'] = function(target, contextKey, context, template) {
  return target.value;
};

transforms['\\\[options\\\]'] = function(target, contextKey, context) {
  var selectedOptionValue;
  var options = target.children;

  function updateContextForOption(option) {
    var selected, name;
    selected = option.selected == true;
    name = option.getAttribute('name');
    context[contextKey+'['+name+']'] = selected;
    if (selected) selectedOptionValue = name;
  }

  for (var i = 0, ii = options.length; i < ii; i++) {
    updateContextForOption(options[i]);
  }

  return selectedOptionValue;
};

module.exports = transforms;