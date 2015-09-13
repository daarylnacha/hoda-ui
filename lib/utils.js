/**
/* utils
*/

'use strict';

var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var util = {

  identity: function(val) {
    return val;
  },

  noop: function() {},

  /**
   * read file content using fs.readFileSync
   */
  getFileContent: function(filename) {
    var fstat = fs.statSync(filename);
    if (!fstat.isFile()) return false;
    var b = null;
    try {
      b = fs.readFileSync(filename).toString();
    } catch(e) {
      b = false;
    }
    return b;
  },

}

exports = module.exports = util;
