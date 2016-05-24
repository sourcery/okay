function benchmark(subject) {
  var started, finished;

  started = +new Date();
  subject();
  finished = +new Date();
  return finished - started;
}

module.exports = benchmark;