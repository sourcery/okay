var emit = require('./emit');
var transforms = require('./transforms');

function eachTransform(callback) {
  for (var i in transforms) {
    callback(i, transforms[i]);
  }
};

function EmissionContext(target, data) {
  this.target = target;
  this.data = data;
};

EmissionContext.prototype.context = function() {
  var data;
  var context;
  var target;

  data = this.data;
  target = this.target;
  context = {};

  for (var i in data) {
    eachTransform(function(transformName, transform) {
      if (data[i] == transformName) {
        context[i] = transform(target)
      }
    });

    if (context[i] == undefined) context[i] = data[i];
  }

  return context;
};

module.exports = EmissionContext;