/**
 * Application Functions
 */

var _ = require('underscore');
var hUtil = require('./utils');
var configs = require('./configs');
var elements = require('./initelements');
var render = require('./render');

'use strict';



var app = {} || app;
app.prototype = app.prototype || {};

/**
 * generate id for new element
 */
app.prototype._generateId = function () {
  var newId = null;

  if (this.elementIds.length) {
    newId = this.elementIds[this.elementIds.length - 1] + 1;
    this.elementIds.push(newId);
  }else{
    newId = 1;
    this.elementIds.push(newId);
  }
  return newId;
};

/**
 * create Element
 */
app.prototype._createElement = function (el, elname, args) {
  var newId = this._generateId();
  if (args.length) {
    var c = Object.create(el.prototype);
    el.apply(c, args);
  } else {
    var c = new el();
  }
  c.id = newId;
  c.name = elname;
  c.onCreate();
  return c;
};

module.exports = app;
