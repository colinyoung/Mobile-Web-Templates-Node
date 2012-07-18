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
      
      try {
        less.render(data, { compress : true }, function(error, css) {
          if (error) console.log('[error] LESS error on line ' + error.line + ': ' + error.message)
          css ? callback(css.trim().replace(/[\r\n]/g, '')) : callback(null);
        });
      } catch (err) {
        callback(err);
      }
    });
  },
  javascripts: function(callback) {
    fs.readFile(paths.javascripts, 'ascii', function(error, data) {
      if (error) console.log('[error] JavaScript/CoffeeScript: ' + error.message)
      
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