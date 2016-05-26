var each = require('./each');

function sendXhr(target, callback) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open(target.method, target.action);
  function onload(e) { callback.call(target, e, xhr); }
  xhr.addEventListener('load', onload);
  xhr.send(new FormData(target));
}

module.exports = sendXhr;
