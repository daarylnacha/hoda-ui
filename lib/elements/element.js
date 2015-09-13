/**
* Element Super class
*/

'use strict';

/**
* Element Constructor
*/
var element = function () {
  this.id = null;
  this.name = null;
  this.render = null;
  this.type = null;
  this.selector = null;
  this.templatename = null;

  this.onclick = [];
  this.onhover = [];
  this.ondrag = [];
  this.ondblclick = [];
  this.ondrop = [];
}

/**
* Element properties
*/
element.prototype = {
  id: 0,
  name: '',
  render: null,
  type: '',
  selector: '',
  templatename: '',

  onclick: [],
  onhover: [],
  ondrag: [],
  ondblclick: [],
  ondrop: [],

}


function implement() {
  console.log('not implemented');
  return this;
}
/**
* Element abstracts
*/
element.prototype.append  = implement;
element.prototype.getHtml = implement;

/**
 * Add Element to jquery selector
 */
element.prototype.addTo = function(selector) {
  if(this.render)
    this.render.toSelector(selector, this.getHtml());
}

/**
 * On create
 * Callback after element is created
 */
element.prototype.onCreate = function () {
  // setup selector
  if(this.selector)
    this.selector = this.selector + '-' + this.id;
}
/**
 * Rebind events of this element
 */
element.prototype.rebind = function() {
  if(!this.render) return this;
  var fThis = this;
  if(this.onclick.length) {
    this.onclick.forEach(function(f) {
      fThis.render.setEvent("click", fThis.selector, f);
    });
  }
  if(this.onhover.length) {
    this.onhover.forEach(function(f) {
      fThis.render.setEvent('mouseover', fThis.selector, f);
    });
  }
  if(this.ondrag.length) {
    this.ondrag.forEach(function(f) {
      fThis.render.setDrag(fThis.selector, f);
    });
  }
  if(this.ondrop.length) {
    this.ondrop.forEach(function(f) {
      fThis.render.setDrop(fThis.selector, f);
    });
  }
  if(this.ondblclick.length) {
    this.ondblclick.forEach(function(f) {
      fThis.render.setEvent('dblclick', fThis.selector, f);
    });
  }
}

element.prototype.setOnclick = function(func) {
  this.onclick.push(func);
  this.rebind();
  return this;
}

element.prototype.setOnhover = function (func) {
  this.onhover.push(func);
  this.rebind();
  return this;
}

element.prototype.setOndrag = function(func) {
  this.ondrag.push(func);
  this.rebind();
  return this;
}

element.prototype.setOndrop = function (func) {
  this.ondrop.push(func);
  this.rebind();
  return this;
}

element.prototype.setOnDblclick = function(func) {
  this.ondblclick.push(func);
  this.rebind();
  return this;
}

module.exports = element;
















/**

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var jQuery = require('./assets/jquery');
require('./assets/hoda-ui');
'use strict';

(function(document, window, $) {


  var Ids = [0,];

  //configs
  var configs = {
    scriptDir: path.dirname(require.resolve('hoda-ui')),
    templateDir: function() {
      return path.join(this.scriptDir, 'components', 'templates');
    },
    cssFile: function() {
      return path.join(this.scriptDir, 'assets', 'hoda-ui.css');
    }
  }

  //mustache escape
  mustache.escape = function(val) { return val;}

  //hoda utility
  var hUtil = {
    generateId:  function() {
      var newId = null;

      if (Ids.length) {
        newId = Ids[Ids.length - 1] + 1;
        Ids.push(newId);
      }
      return newId;
    },

    loadTemplate: function(tplname, params) {
      var tpl = this.getTemplate(tplname);
      return this.parseTemplate(tpl, params);
    },

    parseTemplate: function(tpl, params) {
      return mustache.render(tpl, params);
    },

    getTemplate: function(tplname) {
      tplname = path.join(configs.templateDir(), tplname + '.tpl');
      return this.getFileContent(tplname);
    },

    getFileContent: function(filename) {
      fstat = fs.statSync(filename);
      if (!fstat.isFile()) return false;
      try {
        b = fs.readFileSync(filename).toString();
      } catch(e) {
        b = false;
      }
      return b;
    },

    appendToWin: function(content) {
      window.$('body').append(content);
    },

    appendToWinHead: function(content) {
      window.$('head').append(content);
    }

  }

  //=================================================== COMPONENTS ===========================================

  //========================
  // Hoda Init
  //========================
  var init = function() {
    window.$('body').addClass('hoda');
    loadStyles();
  }

  //========================
  // Hoda Load Styles
  //========================
  var loadStyles = function() {
    var styles = '<link rel="stylesheet" type="text/css" href="' + configs.cssFile() +'">';
    hUtil.appendToWinHead(styles);
  }

  //========================
  // Hoda Menu bar
  //========================

  //========================
  // Hoda Menu item
  //========================



  //export  modules
  module.exports.init = init;
  module.exports.loadStyles = loadStyles;
  module.exports.MenuBar = MenuBar;
  module.exports.MenuItem = MenuItem;
})(document, window, jQuery);
*/
