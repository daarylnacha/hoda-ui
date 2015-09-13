/**
* Collect all elements
*/

'use strict';

var hUtil = require('./utils');
var configs = require('./configs');
var path = require('path');

/**
* get elements from elements folders
*/
function getElements() {

  var comp = JSON.parse(hUtil.getFileContent( configs.elementsJson() ) );

  return comp;
}

/**
* load elements using require
*/
function initEls() {
  var c = getElements();
  var res = {};
  for (var i in c) {
    res[i] = require(path.join(configs.elementsDir(), c[i] ));
  }
  return res;
}

module.exports = initEls();
