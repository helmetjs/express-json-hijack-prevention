var jsonHijackPrevention = require('..');

var express = require('express');
var request = require('supertest');

describe('hijack prevention middleware', function() {

  var TO_STRINGIFY = {
    hello: 'world',
    foo: [1, 2, 3]
  };

  var STRINGIFIED = JSON.stringify(TO_STRINGIFY);

  function app(options) {

    var result = express();
    result.use(jsonHijackPrevention(options));

    result.get('/old', function(req, res) {
      res.json(TO_STRINGIFY);
    });

    result.get('/new', function(req, res) {
      res.safejson(TO_STRINGIFY);
    });

    return result;
  }

  it('prepends "while(1);" by default', function(done) {
    request(app())
      .get('/new')
      .expect('Content-Type', 'application/json')
      .expect('while(1);' + STRINGIFIED)
      .expect(200, done);
  });

  it('can prepend something else', function(done) {
    request(app({ prepend: 'foo' }))
      .get('/new')
      .expect('Content-Type', 'application/json')
      .expect('foo' + STRINGIFIED)
      .expect(200, done);
  });

  it('keeps the original .json method intact', function(done) {
    request(app())
      .get('/old')
      .expect('Content-Type', 'application/json')
      .expect(STRINGIFIED)
      .expect(200, done);
  });

  it('can overwrite the original .json method', function(done) {
    var app = app({ clobber: true });
    request(app)
      .get('/old')
      .expect('Content-Type', 'application/json')
      .expect('while(1);' + STRINGIFIED)
      .expect(200, function(err) {
        if (err) { return done(err); }
        request(app)
          .get('/new')
          .expect('Content-Type', 'application/json')
          .expect('while(1);' + STRINGIFIED)
          .expect(200, done);
      });
  });

});
