/**
 *  Render Functions
 * wrapper for jquery methods
 */
var path = require('path');
var mustache = require('mustache');
var hUtil = require('./utils');
var configs = require('./configs');


'use strict';

var render = function (win) {
  this.$ = win.$;
  this.$('body').addClass('hoda');
}

render.prototype = {
  $: null,
}

render.prototype.toBody = function (el) {
  this.$('body').append(el);
};

render.prototype.toHead = function (el) {
  this.$('head').append(el);
};

/**
 * Render to jquery selector
 */
render.prototype.toSelector = function (selector, content) {
  this.$(selector).append(content);
};

render.prototype.style = function (cssFile) {
  this.toHead('<link rel="stylesheet" href="' + cssFile + '">');
};

render.prototype.fontawesome = function (iconname, size) {
  size = size || 'fa';
  return '<i class="icon ' + size + ' fa-' + iconname + '"></i>';
};

render.prototype.parse = function (tplname, params) {
  mustache.escape = hUtil.identity;
  return mustache.render(this._loadTemplate(tplname), params);
};

render.prototype._loadTemplate = function (tplname) {
  return hUtil.getFileContent(path.join(configs.templateDir(), tplname + '.tpl'));
};

render.prototype.setEvent = function (eventname, selector, func) {
  console.log(this.$(selector));
  console.log(func);
  console.log(eventname);
  this.$(selector).on(eventname, func);
};

render.prototype.setDrag = function (selector, funcObjects) {
  /**
   * funcObjects should have methods for jquery-ui draggable (start, drag, stop)
   */
  this.$(selector).draggable(funcObjects);
};

render.prototype.setDrop = function (selector, funcObjects) {
  /**
   * funcObjects should have methods/properties for jquery-ui droppable (greedy, activeClass, hoverClass, drop(event, ui ))
   */
   this.$(selector).droppable(funcObjects);
};


module.exports = render;
