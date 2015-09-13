/**
* Menu Bar component
*/

'use strict';

var util = require('util');
var _ = require('underscore');
var hUtil = require('../utils');
var element = require('./element');


var Menubar = function() {
  //call super Constructor
  element.apply(this);
  this.templatename = "menubar";
  this.selector = ".menubarid";
}

util.inherits(Menubar, element);

Menubar.prototype = util._extend(Menubar.prototype, {

  items: [],

  append: function(menuitem) {
    if(_.isArray(menuitem)) {
      this.items = this.items.concat(menuitem);
    } else if (arguments.length) {
      this.items = this.items.concat(_.toArray(arguments));
    }
    return this;
  },

  /**
   * override addTo in element.js
   */
  addTo: function(selector) {
    this.render.toSelector(selector, this.getHtml());
    return this;
  },

  /**
   * get html content
   */
  getHtml: function() {
    var menuObj = {
      id : this.id,
      menuitems: this.items,
    }
    return this.render.parse(this.templatename, menuObj);
  },

});


module.exports = Menubar;
