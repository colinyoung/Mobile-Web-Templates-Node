var fs = require('fs');
var less = require('less');
var CoffeeScript = require('coffee-script');
var jsmin = require('jsmin').jsmin;

var paths = {
  styles: 'assets/styles/application.less',
  javascripts: 'assets/javascripts/application.coffee'
};

var resources = {
  compile: function(callback) {
    var _this = this,
        resources = {};
    
    this.styles(function(css) {
      resources.css = css;
      _this.javascripts(function(js) {
        resources.js  = js;
        callback(resources);
      });
    });
  },
  styles: function(callback) {
    fs.readFile(paths.styles, 'ascii', function(error, data) {
      if (error) return console.log(error);
      
      try {
        less.render(data, { compress : true }, function(something, css) {
          callback(css.trim());
        });
      } catch (err) {
        callback(err);
      }
    });
  },
  javascripts: function(callback) {
    fs.readFile(paths.javascripts, 'ascii', function(error, data) {
      if (error) return console.log(error);
      
      try {
        var cs = CoffeeScript.compile(data);
        callback(jsmin(cs, 2, null));
      } catch (err) {
        callback(err);
      }
    });
  }
};

exports.resources = resources;