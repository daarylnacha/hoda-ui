/**
* Menu Item component
*/

'use strict';

var util = require('util');
var _ = require('underscore');
var hUtil = require('../utils');
var element = require('./element');
var render = require('../render');


var Menuitem = function(lbl, type, icon) {
  //call super constructor
  element.apply(this);

  if (!type) type = 'normal';
  if(lbl == '-') type = 'separator';
  if(type == 'separator') lbl = '';
  this.label = lbl;
  this.type = type;

  if (icon) {
    this.setIcon(icon);
  }

  if (type == 'check') {
    this.setIcon('check');
    this.setChecked(false);
  }
  /**
   * template is joined with menubar
   */
  this.templatename = null;
  /**
   * to be used by onCreate callback to add id to the selector ex: '#menuitem' become '#menuitem-1'
   */
  this.selector = "#menuitem";
}

util.inherits(Menuitem, element);

Menuitem.prototype = util._extend(Menuitem.prototype, {

  label: '',

  icon: null,

  checked: false,

  submenu: [],

  append: function(menuitem) {
    if(_.isArray(menuitem)) {
      this.submenu = this.submenu.concat(menuitem);
    } else if (arguments.length) {
      this.submenu = this.submenu.concat(_.toArray(arguments));
    }
  },

  setIcon: function(iconName) {
    this.icon = render.prototype.fontawesome(iconName);
  },

  setChecked: function(iCheck) {
    this.checked = iCheck;
  },

  isChecked: function() {
    return this.checked;
  },

  checkHandler: function(e) {
    console.log("check handler");
    console.log(this);
    if(this.checked) {
      this.checked = false;
      this.render.$(this.selector).find('.menuitem-icon').css('opacity', '0');
    }else{
      this.checked = true;
      this.render.$(this.selector).find('.menuitem-icon').css('opacity', '1');
    }
  },

  hideParent: function(e) {
    this.render.$(e.target).parent().hide();
  },

  getHtml: hUtil.noop,

  onCreate: function() {
    //call super method
    element.prototype.onCreate.apply(this);

    if (this.type != 'separator') {
      this.setOnclick(this.hideMenu);
    }
    if (this.type == 'check') {
      this.setOnclick(this.checkHandler);
    }
  }
});

module.exports = Menuitem;
