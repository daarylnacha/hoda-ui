
/**
* hoda-ui apps
*/

 var _ = require('underscore');
 var hUtil = require('./lib/utils');
 var configs = require('./lib/configs');
 var elements = require('./lib/initelements');
 var proto = require('./lib/application');
 var merge = require('merge-descriptors');
 var render = require('./lib/render');

/**
 * load vendor
 */
var $ = jQuery = require('./lib/vendor/jquery');
/**
* App Constructor
*/
function app(options) {
  this.appName = _.has(options, 'appName') ? options.appName : 'HodaApp';
  this.appParent = _.has(options, 'appParent') ? options.appParent : 'body';
  this.appWindow = _.has(options, 'appWindow') ? options.appWindow : window;

  this.appWindow.$ = $;
  this.render = new render(this.appWindow);
  this.items = [];
  this.elementIds = [];

  this.init();

  return this;
}

/**
* App properties
*/
app.prototype = {

  /* application name */
  appName: null,
  /* application window */
  appWindow: window,
  /* app parent element selector*/
  appParent: null,
  /* render object */
  appRender: null,
  /* created elements */
  items: null,
  /* element ids */
  elementIds: null,
}

app.prototype = merge(app.prototype, proto.prototype, false);

/**
* App methods
*/
/**
 * init app
 */
 app.prototype.init = function () {
   this.render.style(configs.templateCss());
 };

/**
* get last created id
*/
app.prototype.lastid = function () {
  return this.items.length - 1;
};
app.prototype.getid = app.prototype.lastid;

/**
 * get last created element
 */
app.prototype.last = function (indexFromLast) {
  var idx = indexFromLast ? this.lastid() + indexFromLast : this.lastid();
  return this.items[idx];
};
app.prototype.get = app.prototype.last;

/**
* element method get + element_name (), create + element_name()
*/
_.each(elements, function (c, k) {
// create+componentname(constructor args)
 app.prototype['create' + k] = function () {
    this.items.push(this._createElement(c, k, arguments));
    this.last().render = this.render;
    return this;
 }
 // get+elementname(id optionals)
 app.prototype['get' + k] = function(id) {
   var c = [];
   this.items.forEach(function(i) {
     var t = id || i.id;
     if (i.name == k && i.id == t) c.push(i);
   });
   return c.length == 1 ? c[0] : c;
 }
 // get element by its property
 app.prototype['get' + k + 'By'] = function(prop, val) {
   var c = [];
   c = _.filter(this.items, function(v) {
     return v.hasOwnProperty(prop) && v[prop] == val;
   })
   return c.length == 1 ? c[0] : c;
 }
});

/**
 * static function
 */
app.onDocumentReady = function(fn) {
  $(document).ready(fn);
}

module.exports = app;
