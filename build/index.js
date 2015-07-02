(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _magnifier = require('magnifier');

var _magnifier2 = _interopRequireDefault(_magnifier);

var map = new _magnifier2['default']('.image-map');
var sea = new _magnifier2['default']('.image-sea');

},{"magnifier":4}],2:[function(require,module,exports){

/**
 * Expose global offset
 *
 * @param {Element} el
 * @return {Object}
 * @api public
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (el) {
  var left = 0;
  var top = 0;

  while (el) {
    left += el.offsetLeft;
    top += el.offsetTop;
    el = el.offsetParent;
  }

  return { left: left, top: top };
};

module.exports = exports["default"];


},{}],3:[function(require,module,exports){

/**
 * Module dependencies
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalOffset = require('global-offset');

var _globalOffset2 = _interopRequireDefault(_globalOffset);

/**
 * Expose detection
 *
 * @param {Element} el
 * @param {Object} event
 * @return {Boolean}
 * @api public
 */

exports['default'] = function (el, _ref) {
  var pageX = _ref.pageX;
  var pageY = _ref.pageY;

  var _offset = (0, _globalOffset2['default'])(el);

  var left = _offset.left;
  var top = _offset.top;
  var offsetWidth = el.offsetWidth;
  var offsetHeight = el.offsetHeight;

  return pageX >= left && pageX <= left + offsetWidth && pageY >= top && pageY <= top + offsetHeight;
};

module.exports = exports['default'];


},{"global-offset":2}],4:[function(require,module,exports){

/**
 * Module dependencies
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _globalOffset = require('global-offset');

var _globalOffset2 = _interopRequireDefault(_globalOffset);

var _isPointerInside = require('is-pointer-inside');

var _isPointerInside2 = _interopRequireDefault(_isPointerInside);

/**
 * Expose magnifier
 *
 * @param {Element} el
 * @api public
 */

var Magnifier = (function () {
  function Magnifier(el) {
    _classCallCheck(this, Magnifier);

    if (typeof el === 'string') el = document.querySelector(el);
    this.el = el;
    this.lens = document.createElement('div');
    this.lens.style.position = 'absolute';
    this.lens.style.border = '2px solid #eee';
    this.lens.style.borderRadius = '75px';
    this.lens.style.height = '150px';
    this.lens.style.width = '150px';
    this.lens.style.backgroundColor = '#fff';
    this.lens.style.backgroundRepeat = 'no-repeat';
    this.lens.style.overflow = 'hidden';
    this.lens.style.visibility = 'hidden';
    this.lens.className = 'magnifier';
    this.append();
    this.show();
    this.calcImageSize();
    this.onmove = this.onmove.bind(this);
    this.onend = this.hide.bind(this);
    this.bind();
  }

  _createClass(Magnifier, [{
    key: 'append',
    value: function append() {
      var parent = this.el.parentNode;
      var next = this.el.nextSibling;
      while (next && next.nodeType > 1) next = next.nextSibling;
      if (!next) return parent.appendChild(this.lens);
      return parent.insertBefore(this.lens, next);
    }
  }, {
    key: 'calcImageSize',
    value: function calcImageSize() {
      var _this = this;

      var orig = document.createElement('img');
      orig.style.position = 'absolute';
      orig.style.width = 'auto';
      orig.style.visibility = 'hidden';
      orig.src = this.el.src;

      orig.onload = function () {
        _this.imageWidth = orig.offsetWidth;
        _this.imageHeight = orig.offsetHeight;
        orig.parentNode.removeChild(orig);
        _this.hide();
        _this.lens.style.visibility = 'visible';
        _this.lens.style.backgroundImage = 'url(' + _this.el.src + ')';
      };

      this.lens.appendChild(orig);
    }
  }, {
    key: 'onmove',
    value: function onmove(event) {
      event.preventDefault();
      event = event.type.indexOf('touch') === 0 ? event.changedTouches[0] : event;

      if (!(0, _isPointerInside2['default'])(this.el, event)) return this.hide();
      this.show();

      var pageX = event.pageX;
      var pageY = event.pageY;

      var _offset = (0, _globalOffset2['default'])(this.el);

      var left = _offset.left;
      var top = _offset.top;
      var _el = this.el;
      var offsetLeft = _el.offsetLeft;
      var offsetTop = _el.offsetTop;
      var offsetWidth = _el.offsetWidth;
      var offsetHeight = _el.offsetHeight;
      var _lens = this.lens;
      var lensWidth = _lens.offsetWidth;
      var lensHeight = _lens.offsetHeight;

      var ratioX = this.imageWidth / offsetWidth;
      var ratioY = this.imageHeight / offsetHeight;
      var imageX = (left - pageX) * ratioX + lensWidth / 2 - 2;
      var imageY = (top - pageY) * ratioY + lensHeight / 2 - 2;
      var x = pageX - lensWidth / 2 - (left !== offsetLeft ? left - offsetLeft : 0);
      var y = pageY - lensHeight / 2 - (top !== offsetTop ? top - offsetTop : 0);

      this.lens.style.left = x + 'px';
      this.lens.style.top = y + 'px';
      this.lens.style.backgroundPosition = imageX + 'px ' + imageY + 'px';
    }
  }, {
    key: 'bind',
    value: function bind() {
      this.el.addEventListener('touchstart', this.onmove, false);
      this.el.addEventListener('mousemove', this.onmove, false);
      this.el.addEventListener('touchmove', this.onmove, false);
      this.el.addEventListener('touchend', this.onend, false);
      this.lens.addEventListener('mousemove', this.onmove, false);
      this.lens.addEventListener('touchmove', this.onmove, false);
      this.lens.addEventListener('touchend', this.onend, false);
      return this;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      this.el.removeEventListener('touchstart', this.onmove, false);
      this.el.removeEventListener('mousemove', this.onmove, false);
      this.el.removeEventListener('touchmove', this.onmove, false);
      this.el.removeEventListener('touchend', this.onend, false);
      this.lens.removeEventListener('mousemove', this.onmove, false);
      this.lens.removeEventListener('touchmove', this.onmove, false);
      this.lens.removeEventListener('touchend', this.onend, false);
      return this;
    }
  }, {
    key: 'show',
    value: function show() {
      this.lens.style.display = 'block';
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.lens.style.display = 'none';
      return this;
    }
  }]);

  return Magnifier;
})();

exports['default'] = Magnifier;
module.exports = exports['default'];


},{"global-offset":2,"is-pointer-inside":3}]},{},[1]);
