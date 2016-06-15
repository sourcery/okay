var each = require('./each');

function count(object) {
  var i = 0;
  each(object, function() { i++; });
  return i;
}

module.exports = count;