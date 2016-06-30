var each = require('./each');
var log = require('./log');

function getConfig(name, target) {
  var rawOptions, parsedOptions;
  rawOptions = target.getAttribute('data-watch-'+name);
  parsedOptions = JSON.parse(rawOptions);
  return parsedOptions;
};

module.exports = function PerformWatcher(name, watcher, target, emittedData) {
  var config = getConfig(name, target);
  if (!config) return;

  each(config, function(configValue, configKey) {
    var watcherValue;

    each(configKey.split(','), function(match) {
      var inverted;

      if (match.slice(0, 1) === '!') {
        inverted = true;
        match = match.replace(/^!/, '')
      }

      each(emittedData, function(dataValue, dataKey) {
        if (watcherValue) return;
        if (match == dataKey) watcherValue = (inverted ? !dataValue : dataValue);
      });
    });

    if (watcherValue != undefined) {
      log.log('watcher', {
        watcher: watcher.name,
        argument: config[configKey],
        value: watcherValue,
        target: log.target(target),
        config: config
      });

      watcher(target, config[configKey], watcherValue, config);
    }
  });
};
