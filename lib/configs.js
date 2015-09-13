/**
/* Configurations
*/

'use strict';

var path = require('path');


var configs = {
  scriptDir: path.dirname(require.resolve('hoda-ui')),

  templateDir: function () {
    return path.join(this.scriptDir, 'templates');
  },

  templateCss:  function () {
    return path.join(this.scriptDir, 'templates', 'styles.css');
  },

  elementsJson: function() {
    return path.join(this.scriptDir, 'lib', 'elements', 'elements.json');
  },

  elementsDir: function() {
    return path.join(this.scriptDir, 'lib', 'elements');
  },
  
}

module.exports = configs;
