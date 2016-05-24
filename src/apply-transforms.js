var each = require('./each');
var transforms = require('./transforms');
var perform = require('node-interactor');
function ApplyTransforms() {}
module.exports = ApplyTransforms;
ApplyTransforms.perform = perform;

// ---

ApplyTransforms.prototype.perform = function() {
  rawData = this.context.rawData;
  target = this.context.target;
  data = {};

  each(rawData, function(dataValue, dataKey) {
    each(transforms, function(transform, transformName) {
      if (new RegExp(transformName).test(dataValue)) {
        data[dataKey] = transform(target, dataKey, data, dataValue);
      }
    });

    if (data[dataKey] == undefined) data[dataKey] = rawData[dataKey];
  });

  this.context.data = data;
};
