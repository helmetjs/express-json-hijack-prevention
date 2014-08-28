function makeFunction(prepend) {
  return function(val) {
    var app = this.app;
    var stringified = JSON.stringify(val,
                                     app.get('json replacer'),
                                     app.get('json spaces'));
    if (!this.get('Content-Type')) {
      this.set('Content-Type', 'application/json');
    }
    return this.send(prepend + stringified);
  };
}

module.exports = function(options) {

  options = options || {};
  var prepend = options.prepend || 'while(1);';

  var safejson = makeFunction(prepend);

  return function(req, res, next) {
    res.safejson = safejson;
    next();
  };

};
