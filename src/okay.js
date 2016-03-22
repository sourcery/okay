(function() {
  'use strict';

  var Okay;
  window.Okay = Okay = {};

  function applyClass(target, data) {
    var options, key, className;
    options = JSON.parse(target.getAttribute('data-watch-class'));

    for (key in data) {
      className = options[key];
      if (className) { target.classList.toggle(className, data[key]); }
    }
  }

  Okay.emit = function (data) {
    var targets, currentTarget, i, ii;

    targets = document.querySelectorAll('[data-watch-class]');

    for (i = 0, ii = targets.length; i < ii; i++) {
      applyClass(targets.item(i), data);
    }
  };
}());
