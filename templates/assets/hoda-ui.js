//TODO :
//- panel container setup
//- panel vertical and horizontal setup
//- form element : dropdown list
//- form element : spinner (fix scroll)
//- form element : button dropdown
//- form element : tree list
//- form element : modal box
'use strict';
//utils

if (typeof jQuery !== 'function' && typeof require === 'function') { var jQuery = require('./jquery.js');}

;(function($) {
  var hoda_version = '0.1';

  //====================
  // Slim It
  //====================
  var _slimIt = function(el) {
    $(el).css('font-weight', '100');
  }


  //====================
  // Hoda styler
  //====================
  var _hodaStyler = function(el) {
    if (!el.hasOwnProperty('jquery')) {
      this.el = $(el);
    } else {
      this.el = el;
    }
  }

  _hodaStyler.prototype = {
    constructor: _hodaStyler,

    el: null,

    setHeight: function(height) {
      this.el[0].style.height = parseInt(height) + 'px';
    },

    setWidth: function(width) {
      this.el[0].style.width = parseInt(width) + 'px';
    },

    setColor: function(color) {
      this.el[0].style.color = color;
    },

    setBackColor: function(bColor) {
      this.el[0].style.backgroundColor = bColor;
    }

  }

  //====================
  // Hoda Panel
  //====================
  var panel_defaults = {
    handlecolor: '#cdcdcd',
    backgroundcolor : '#e9e9e9',
    panelbackground: '#7f98aa',
    width: null,
    height: null,
    fullsize : true,
  }

  var _hodaPanel = function(el, opt, callback) {
    var options = $.extend(panel_defaults, opt);

    var elem = $(el);

    //size
    if (options.fullSize) {
      elem.css('position', 'absolute')
          .css('top', 0)
          .css('left', 0)
          .css('right', 0)
          .css('bottom', 0);
    }
    var width = elem.width();
    var height = elem.height();
    //color
    if (options.backgroundcolor) {
      elem.css('background-color', options.backgroundcolor);
    }

    //find adjacent panel by type
    var findclosest = function(el, borderClass) {
      var prevs = el.prevUntil('.'+borderClass);
      var nexts = el.nextUntil('.'+borderClass);
      var alls = prevs.toArray().concat(el[0]).concat(nexts.toArray());
      return alls;
    }

    //childs panel
    //set margin
    elem.find('>div').css('margin', 0)
                     .css('box-sizing', 'border-box')
                     .css('float', 'left');
    //enumerate panels and set color, margin and width
    var panels = [];
    var elems = elem.find('>div');
    for(var i=0;i<elems.length;i++) {
      enumPanelsAsync(i);
    }
    function enumPanelsAsync(i) {
      setTimeout(function() {
        enumPanels(i, [setheights, setupHandle, callback]);
      }, 0);
    }

    //bind on size change
    el.onresize = function() {
      //console.log('resize ' + el.clientHeight + ' , ' + el.clientWidth);
      var elemHeight = el.clientHeight/panels.length;
      for(var i=0;i<panels.length;i++) {
        if(panels[i].hasOwnProperty('length')) {
          panels[i].forEach(function(x) {
            x.style.height = elemHeight + "px";
          });
        }else{
          panels[i].style.height = elemHeight + "px";
        }
      }
    }

    function enumPanels(i) {
      var el = elems[i];
      var cp = $(el);
      var cptype = new Object();
      if(el.className.indexOf('panel-horizontal') != -1) cptype.horz=true;
      if(el.className.indexOf('panel-vertical') != -1) cptype.vert=true;

      var horz = [];
      var verts = [];
      if (Object.keys(cptype).length) {
        // color
        if (el.dataset.backcolor) {
          el.style.backgroundColor = el.dataset.backcolor;
        }else{
          el.style.backgroundColor = options.panelbackground;
        }

        if (cptype.horz) {
          //find siblings
          var sibs = findclosest(cp, 'panel-vertical');
          //set width
          var fixwidth = 0;
          var sfluids = 0;
          sibs.forEach(function(x){
            var sibwidth = parseInt(x.dataset.width);
            if(sibwidth) {
              fixwidth += sibwidth;
              sfluids++;
            }
          });
          if (el.dataset.width) {
            el.style.width = el.dataset.width;
          }else{
            el.style.width = (Math.floor((width - fixwidth)/(sibs.length-sfluids))) + "px";
          }
          el.dataset.startwidth = el.style.width;
          if (!el.previousElementSibling || el.previousElementSibling.className.indexOf('panel-vertical') != -1) {
            panels.push(sibs);
          }
        }
        if (cptype.vert) {
          //set width
          el.style.width = width+"px";
          var sibs = findclosest(cp, 'panel-horizontal');
          if (!el.previousElementSibling || el.previousElementSibling.className.indexOf('panel-horizontal') != -1) {
            panels.push(sibs);
          }
        }
      }
      //callback when finish
      if(arguments) {
        var cb = arguments[1][0];
        var args = arguments[1].slice(1);
      }
      if (cb) {
        if(i == elems.length-1) cb(args);
      }
    };

    function setheights() {
      //set heights
      var fixheights = 0;
      var count = 0;
      var vertcount = 0;
      //set fixed heights
      for (i=0;i<panels.length;i++) {
        var maxheight = 0;
        panels[i].forEach(function(x) {
          var h = parseInt(x.dataset.height);
          h = h ? h : 0;
          if(x.className.indexOf('panel-vertical') >= 0) {
            vertcount++;
            if (h) {
              x.style.height = h + "px";
              fixheights += h;
              h=0;
              vertcount--;
            }
          }
          maxheight = h > maxheight ? h : maxheight;
        });
        if (panels[i][0].className.indexOf('panel-vertical') >= 0) vertcount--;
        if(maxheight) {
          fixheights += maxheight;
          count++;
          panels[i].forEach(function(x) {
            x.style.height = maxheight + "px";
            x.dataset.height = maxheight + "px";
          });
        }
      };
      //set fluid heights
      var fheight = (height-fixheights)/(panels.length+vertcount - count);
      for (i=0;i<panels.length;i++) {
        panels[i].forEach(function(x){
          if(!x.dataset.height) { //&& !x.clientHeight) {
            x.style.height = fheight + "px";
          }
        });
      }
      //callback when finish
      var cb, args;
      try {
        cb = arguments[0][0];
        args = arguments[0].slice(1);
      } catch (e) {
        return;
      }
      if(cb) {
        cb(args);
      }
    }

    function setupHandle() {
      elem.find('> div[data-resize=true]').each(function() {
        if (this.className.indexOf('panel-horizontal')>= 0) {
          if (this.nextElementSibling && this.nextElementSibling.className.indexOf('panel-horizontal') >= 0) {
            $(this).append('<div class="handle" data-axis="x" draggable="true"></div>');
          }
        }else if (this.className.indexOf('panel-vertical')>= 0) {
          if (this.previousElementSibling != null) {
            $(this).append('<div class="handle" data-axis="y" draggable="true"></div>');
          }
        }
      });

      function _getPrevHorz(el) {
        return [el].concat($(el).prevUntil('.panel-vertical').toArray());
      }

      var handle = elem.find('.handle');
      var minwidth = 10;
      var minheight = 50;
      for(var i=0;i<handle.length;i++) {
        //jquery ui draggable
        var ondragstartx = function(e) {
          //console.log(this.style.left);
        }
        var ondragx = function(e, f) {
          var parent = this.parentElement;
          var nextEl = parent.nextElementSibling;
          var xwidth = parseInt(parent.style.width) + parseInt(nextEl.style.width);
          if (parseInt(this.style.left) > xwidth - minwidth) return false;
          var ret = true;
          if (this.style.left == 'auto' || parseInt(this.style.left) < minwidth) {
            this.style.left = minwidth + "px";
            //ret = false;
          }
          parent.style.width = this.style.left;
          nextEl.style.width = (xwidth - parseInt(parent.style.width)) + "px";
          return ret;
        }
        var ondragendx = function(e) {
          var parent = this.parentElement;
          this.style.left = "auto";
          this.style.right = 0;
        }
        var ondragstarty = function(e, f) {
          var parent = this.parentElement;
          var prevEl = parent.previousElementSibling;
          parent.dataset.startheight = parent.style.height;
          prevEl.dataset.startheight = prevEl.style.height;
        }
        var ondragy = function(e, f) {

          var parent = this.parentElement;
          var prevEl = parent.previousElementSibling;
          var xheight = parseInt(parent.dataset.startheight) + parseInt(prevEl.dataset.startheight);
          if (parseInt(prevEl.style.height) < minheight) {
            //prevEl.style.height = minheight + 'px';
            return false;
          }
          if (parseInt(parent.style.height) < minheight ) {
            //parent.style.height = minheight + 'px';
            return false;
          }

          parent.style.height = (parseInt(parent.dataset.startheight) - this.offsetTop) + "px";
          if (prevEl.className.indexOf('panel-horizontal') >= 0) {
            var self = this;
            var starth = parseInt(prevEl.dataset.startheight);
            _getPrevHorz(prevEl).forEach(function(x) {
              x.style.height = (starth + self.offsetTop) + "px";
            });
          }else {
            prevEl.style.height = (parseInt(prevEl.dataset.startheight) + this.offsetTop) + "px";
          }
          var child_cont = $(parent).children('.panel-container');
          if(child_cont.length) {
            child_cont[0].onresize();
          }
        }
        var ondragendy = function(e) {
          var parent = this.parentElement;
          var prevEl = parent.previousElementSibling;
          if (prevEl.clientHeight <= minheight) {
            parent.style.height = parseInt(parent.style.height) - (minheight - parseInt(prevEl.style.height)) + "px";
            if (prevEl.className.indexOf('panel-horizontal') >= 0) {
              _getPrevHorz(prevEl).forEach(function(x) {
                x.style.height = minheight + "px";
              });
            }else {
              prevEl.style.height = minheight + "px";
            }
          }
          if (parent.clientHeight <= minheight) {
            if (prevEl.className.indexOf('panel-horizontal') >= 0) {
              _getPrevHorz(prevEl).forEach(function(x) {
                x.style.height = parseInt(x.style.height)  - (minheight - parseInt(parent.style.height)) + "px";
              });
            }else {
              prevEl.style.height = parseInt(prevEl.style.height) - (minheight - parseInt(parent.style.height)) + "px";
            }
            parent.style.height = minheight + "px";
          }
          this.style.top = 0;
          parent.dataset.startheight = 0;
          prevEl.dataset.startheight = 0;
          var child_cont = $(parent).children('.panel-container');
          if(child_cont.length) {
            child_cont[0].onresize();
          }
        }

        var axis = handle[i].dataset.axis;
        if (axis == 'x') {
          var hOpt = {axis: 'x', drag: ondragx, stop: ondragendx, start: ondragstartx, cursor: "col-resize"};
        }else {
          var hOpt = {axis: 'y', drag: ondragy, stop: ondragendy, start: ondragstarty, cursor: "row-resize"};
        }
        $(handle[i]).draggable(hOpt);
      };
      //callback when finish
      var cb = arguments[0][0];
      if(cb) {
        cb();
      }
    }
  }

  var IDs = [0];
  var _generateId = function() {
    var newID = IDs[IDs.length-1] + 1;
    IDs.push(newID);
    return newID;
  }

  //===================
  // Hoda Dropdown
  //===================
  var _hDropdown = function(el, options) {
    this.run(el, options);
  }

  _hDropdown.prototype = {
    constructor: _hDropdown,

    el: null,

    options: {
      autoclose: false,
      onhover: false
    },

    assets: {
      oldEl: null,
      ul: null,
      selects: null,
    },

    run: function(el, options){
      this.el = $(el);
      this.options = $.extend({}, this.options, options);
      this.assets = $.extend({}, this.assets);

      this._setupStyle();

      this._setupEventHandler();
    },

    _setupStyle: function() {
      this.el.hide();

      //generate new Elements
      var elId = _generateId();
      this.el.parent().append('<div id="hoda-' + elId + '" class="hoda-select"></div>');

      //swap with old one
      this.assets.oldEl = this.el;
      this.el = $('#hoda-' + elId);
      this.el.html('<ul></ul>');

      this.assets.ul = this.el.find('ul');
      this.assets.ul[0].style.display = 'none';
      for(var i=0;i<this.assets.oldEl[0].length;i++) {
        this.assets.ul.append('<li data-value="' + this.assets.oldEl[0][i].value + '">' + this.assets.oldEl[0][i].text + '</li>');
      }

      //default select
      this.assets.selects = Array.prototype.slice.call(this.assets.ul[0].children);
      var selIdx = this.assets.oldEl[0].selectedIndex;
      this.el.prepend('<span class="selected">' + this.assets.selects[selIdx].textContent + '</span>');
      this.assets.selects[selIdx].dataset.selected = 'true';

    },

    _showSelected: function(index) {
      this.assets.selects.forEach(function(x) {
        x.dataset.selected = 'false';
      });
      this.assets.selects[index].dataset.selected = 'true';
      this.el.find('>span.selected').html(this.assets.selects[index].textContent);
      this.assets.oldEl.selectedIndex = index;
    },

    _setupEventHandler: function() {
      var ul = this.assets.ul[0];
      var thisObj = this;

      //on click
      this.el[0].addEventListener('click', function(e) {
        if (ul.style.display == 'none') {
          ul.style.display = 'block';
        }else {
          ul.style.display = 'none';
        }
      });

      //on choice select
      this.assets.selects.forEach(function(x) {
        x.addEventListener('click', function(e) {
          thisObj._showSelected(thisObj.assets.selects.indexOf(e.target));
        });
      });

      //onhover
      if(this.options.onhover) {
        if(!this.options.autoclose) this.options.autoclose = true;
        this.el[0].onmouseover = function(e) {
          ul.style.display = 'block';
        }
      }

      //autoclose
      if(this.options.autoclose) {
        ul.onmouseleave = function(e) {
          ul.style.display = 'none';
        };
      }
    },

  }

  //====================
  // Hoda Spinner
  //====================
  var _hodaSpinner = function(el, options) {
    this.run(el, options);
  }

  _hodaSpinner.prototype = {
    constructor: _hodaSpinner,

    el: null,

    options: {
      minvalue: 0,
      maxvalue: 100,
      prefix: '',
      suffix: '',
      margin: 20
    },

    assets: {
      sline: null,
      sbutton: null,
      label: null,
      sfiller: null
    },

    run: function(el, options) {
      this.el = $(el);
      this.options = $.extend({}, this.options, options);
      this.assets = $.extend({}, this.assets);

      // add class
      if(this.el[0].className.indexOf('hoda-spinner') < 0) {
        this.el.addClass('hoda-spinner');
      }
      this._setupStyle();

      this.assets.sbutton.draggable({axis: 'x', containment: this.assets.sline, drag: this._getDragHandler()});

      this._setupScrollHandler();

      this._setupClickHandler();
    },

    _setupStyle: function() {
      var value = parseInt(this.el[0].dataset.value);
      this.el.append('<div class="spinner-label"></div>');
      this.el.append('<div class="spinner-line"></div>');

      this.assets.label = this.el.find('.spinner-label');
      this.assets.sline = this.el.find('.spinner-line');
      this.assets.sline.append('<div class="spinner-filler"></div>');
      this.assets.sline.append('<div class="spinner-button"></div>');
      this.assets.sbutton = this.el.find('.spinner-button');
      this.assets.sfiller = this.el.find('.spinner-filler');

      this.assets.sbutton[0].style.top = '-' + (this.assets.sbutton.height() - this.assets.sline.height())/2 + 'px';

      this._setLabelVal(value);
      this.assets.sline.width(this.assets.sline.width() - this.assets.label.width() - this.options.margin);
      this._setpos(value);

    },

    _setpos: function(val) {
      var p = val / (this.options.maxvalue - this.options.minvalue + 1);

      var w = parseInt(this.assets.sline[0].style.width) - this.assets.sbutton.width();
      this.assets.sbutton[0].style.left = p * (w) + 'px';

      this.assets.sfiller[0].style.width = parseInt(this.assets.sbutton[0].style.left) + parseInt(this.assets.sbutton.width())/2 + 'px';
    },

    _getVal: function() {
      var width = parseInt(this.assets.sline[0].style.width) - parseInt(this.assets.sbutton.width())/2;
      var v = this.options.minvalue + ((this.options.maxvalue - this.options.minvalue + 1) * this.assets.sbutton.position().left / width);
      return Math.round(v);
    },

    _setLabelVal: function(val) {
      this.assets.label.html(this.options.prefix + ' ' + val + ' ' + this.options.suffix);
    },

    _getDragHandler: function() {

      var sl = this.assets.sline;
      var sb = this.assets.sbutton;
      var lb = this.assets.label;
      var sf = this.assets.sfiller;

      var min = this.options.minvalue;
      var max = this.options.maxvalue;

      var pre = this.options.prefix;
      var suf = this.options.suffix;

      var el = this.el;

      return function() {
        var pos = (parseInt(this.style.left) );
        var width = parseInt(sl[0].style.width) - parseInt(sb[0].style.width);
        var p_pos = (pos/width*100);
        var value = Math.round(min + (max - min + 1) * (p_pos/100));
        //console.log(p_pos);
        lb.html(pre + ' ' + value + ' ' + suf);
        el[0].dataset.value = value;
        sf[0].style.width = parseInt(this.style.left) + parseInt(this.style.width)/2 + 'px';
      }
    },

    _setupScrollHandler: function() {
      console.log(this.el);

      var onscroll = function(e) {
        console.log(e);
      }

      this.el[0].onwheel = onscroll;
    },

    _setupClickHandler: function() {
      var thisObj = this;

      this.el.on('click', function(e) {
        var posX = 0;

        if (['spinner-line', 'spinner-filler'].indexOf(e.target.className) >= 0) {
          posX = e.offsetX;
        }else if (e.target.className == thisObj.el[0].className) {
          posX = (e.offsetX - thisObj.assets.sline.position().left);
        }
        var maxPos = thisObj.assets.sline.width() - thisObj.assets.sbutton.width();
        if (posX >= maxPos) posX = maxPos;
        thisObj.assets.sbutton[0].style.left = posX + 'px';

        var xPos = parseInt(thisObj.assets.sbutton[0].style.left) + parseInt(thisObj.assets.sbutton.width())/2 + 'px';
        thisObj.assets.sfiller[0].style.width = xPos;

        var value = thisObj.__proto__._getVal.call(thisObj);
        thisObj.__proto__._setLabelVal.call(thisObj, value);
      });
    }

  }

  //=====================
  // Button
  //=====================
  var _hodaButton = function(el, options) {
    this.run(el, options);
  }

  _hodaButton.prototype = {
    constructor: _hodaButton,

    el: null,

    options: {
      color: 'normal',
      type: 'normal',
      height: null,
      width: null,
      onSelected: null,
      onLostSelect: null,
      onClick: null,
    },

    assets: {
      buttons: null,
      dropdown: null,
    },

    avail_color: [ 'blue', 'green', 'white', 'red', 'yellow', 'darkblue'],

    run: function(el, options) {
      this.el = $(el);
      this.options = $.extend({}, this.options, options);
      this.assets = $.extend({}, this.assets);

      //check if this is button group
      if(this.el.hasClass('button-group')) {
        this.options.type = 'button-group';
        this._enumButtons();

        if(this.el.hasClass('select-button')) {
          this._setSelectHandler();
        }
      } else {
        this._setupStyle();
      }

      //check if this is button dropdown
      if(this.options.type == 'button-dropdown') {
        this._setDropdown();
      }

      //setupClickHandler
      if(this.options.onClick) {
        this._setClickHandler();
      }
    },

    _setupStyle: function() {
      var hStyler = new _hodaStyler(this.el);

      if (this.options.type == 'button-group') return;

      if (this.avail_color.indexOf(this.options.color) >= 0) {
        this.el.addClass(this.options.color);
      }

      if (this.options.height) {
        hStyler.setHeight(this.options.height);
      }

      if (this.options.width) {
        hStyler.setWidth(this.options.width);
      }

    },

    _enumButtons: function() {
      this.assets.buttons = this.el.find('button');
    },

    _setSelectHandler: function() {
      if (this.options.type != 'button-group') return;

      var thisObj = this;

      var selectHandler  = function(e) {
        var btn = $(e.target);

        if (btn.hasClass('disabled')) return;

        for(var i=0;i<thisObj.assets.buttons.length;i++) {
          var b = $(thisObj.assets.buttons[i]);
          if(b.hasClass('selected') && thisObj.options.onLostSelect) {
            thisObj.options.onLostSelect(b[0]);
          }
          b.removeClass('selected');
        }

        btn.addClass('selected');
        if(thisObj.options.onSelected) thisObj.options.onSelected(btn[0]);
      }

      for(var i=0;i<this.assets.buttons.length;i++) {
        var btn = this.assets.buttons[i];
        $(btn).on('click', selectHandler);
      }
    },

    _setClickHandler:  function() {
      var thisObj = this;

      if(this.options.type != 'button-group') {
        this.el[0].addEventListener('click', function(e) { thisObj.options.onClick(e.target)});
      }
    },

    _setDropdown: function() {
      this.assets.dropdown = $(this.el.children('ul'));
      this.assets.dropdown.hide();

      var btn = $(this.el.children('button'));
      btn.after('<button class="icon"><i class="fa fa-chevron-down"></i></button>');

      this.assets.buttons = this.el.find('button');

      this.assets.buttons.wrapAll('<div class="button-group"></div>');

      var btndrop = this.assets.buttons.filter('.icon');

      this.assets.dropdown[0].style.width = this.el.find('.button-group').width() + 'px';
      this.assets.dropdown[0].style.top = this.el.find('.button-group').height() + 'px';

      var thisObj = this;
      btndrop.on('click', function(e) {
        thisObj.assets.dropdown.toggle();
      });

      this.assets.dropdown.on('click', function(e) {
        thisObj.assets.dropdown.toggle();
      });
    }

  }

  //=====================
  // Modal box
  //=====================


  //=====================
  // Extend jQuery
  //=====================
  $.fn.extend({
    hoda_version: hoda_version,
    slimIt: function() {
      this.each(function() {
        _slimIt(this);
      })
      return this;
    },
    hodaPanel: function(options, cb) {
      this.each(function() {
        _hodaPanel(this, options, cb);
      });
      return this;
    },
    hodaDropdown: function(options) {
      this.each(function() {
        var hDropdown = new _hDropdown(this, options);
      });
    },
    hodaSpinner: function(options) {
      this.each(function() {
        var hSpinner = new _hodaSpinner(this, options);
      });
    },
    hodaButton: function(options) {
      this.each(function() {
        var hButton = new _hodaButton(this, options);
      });
    }

  });
}(jQuery));
