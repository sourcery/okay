var each = require('./each');

function mergeToHash(items) {
  var result;

  result  = {};

  each(items, function(item) {
    each(item, function(val, key) {
      result[key] = val;
    });
  });

  return result
}

module.exports = mergeToHash;