(function() {
  var Canvas, dom, extend, jsdom;

  jsdom = require("jsdom");

  Canvas = require("./canvas");

  extend = function(obj1, obj2) {
    var k, v, _results;
    _results = [];
    for (k in obj2) {
      v = obj2[k];
      _results.push(obj1[k] = v);
    }
    return _results;
  };

  dom = function(html, cb) {
    return jsdom.env(html, [], function(errors, window) {
      var doc, _ce, _document;
      doc = window.document;
      _document = global.document;
      _ce = doc.createElement;
      doc.createElement = function(tagName) {
        var el;
        el = _ce.call(doc, tagName);
        if (tagName === 'canvas') extend(el, new Canvas());
        return el;
      };
      global.document = doc;
      cb();
      return global.document = _document;
    });
  };

  module.exports.dom = dom;

}).call(this);