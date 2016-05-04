var arrayPrototypeSlice = Array.prototype.slice;

module.exports = function slice(object) {
  return arrayPrototypeSlice.apply(object);
};
