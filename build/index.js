(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _magnifier = require('magnifier');

var _magnifier2 = _interopRequireDefault(_magnifier);

var lens = new _magnifier2['default']('.image img');

},{"magnifier":2}],2:[function(require,module,exports){

/**
 * Expose magnifier
 *
 * @param {Element} el
 * @api public
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    this.className = 'magnifier';
    insertAfter(this.lens, this.el);
    this.move = this.onmove.bind(this);
    this.show();
    this.getImageSize();
    this.bind();
  }

  _createClass(Magnifier, [{
    key: 'getImageSize',
    value: function getImageSize() {
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
      event = event.type === 'touchmove' ? event.changedTouches[0] : event;
      var pageX = event.pageX;
      var pageY = event.pageY;

      var _offset = offset(this.el);

      var left = _offset.left;
      var top = _offset.top;

      if (!isInside(this.el, event)) return this.hide();
      this.show();

      var ratioX = this.imageWidth / this.el.offsetWidth;
      var ratioY = this.imageHeight / this.el.offsetHeight;
      var imageX = (left - pageX) * ratioX + this.lens.offsetWidth / 2;
      var imageY = (top - pageY) * ratioY + this.lens.offsetHeight / 2;
      var x = pageX - this.lens.offsetWidth / 2;
      var y = pageY - this.lens.offsetHeight / 2;

      if (!isStatic(this.el)) {
        x -= left - this.el.offsetLeft;
        y -= top - this.el.offsetTop;
      }

      this.lens.style.left = x + 'px';
      this.lens.style.top = y + 'px';
      this.lens.style.backgroundPosition = imageX + 'px ' + imageY + 'px';
    }
  }, {
    key: 'bind',
    value: function bind() {
      this.el.addEventListener('mousemove', this.move, false);
      this.el.addEventListener('touchmove', this.move, false);
      this.lens.addEventListener('mousemove', this.move, false);
      this.lens.addEventListener('touchmove', this.move, false);
      return this;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      this.el.removeEventListener('mousemove', this.move, false);
      this.el.removeEventListener('touchmove', this.move, false);
      this.lens.removeEventListener('mousemove', this.move, false);
      this.lens.removeEventListener('touchmove', this.move, false);
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

/**
 * Insert after
 *
 * @param {Element} el
 * @param {Element} ref
 * @return {Element}
 * @api private
 */

function insertAfter(el, ref) {
  var parent = ref.parentNode;
  var next = ref.nextSibling;
  while (next && next.nodeType > 1) next = next.nextSibling;
  if (!next) return parent.appendChild(el);
  return parent.insertBefore(el, next);
}

/**
 * Detect pointer event is inside
 *
 * @param {Element} el
 * @param {Event} event
 * @return {Boolean}
 * @api private
 */

function isInside(el, event) {
  var pageX = event.pageX;
  var pageY = event.pageY;

  var _offset2 = offset(el);

  var left = _offset2.left;
  var top = _offset2.top;
  var offsetWidth = el.offsetWidth;
  var offsetHeight = el.offsetHeight;

  return pageX >= left && pageX <= left + offsetWidth && pageY >= top && pageY <= top + offsetHeight;
}

/**
 * Detect element is static
 *
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

function isStatic(el) {
  var _offset3 = offset(el);

  var left = _offset3.left;
  var top = _offset3.top;
  var offsetLeft = el.offsetLeft;
  var offsetTop = el.offsetTop;

  return left === offsetLeft && top === offsetTop;
}

/**
 * Global offset
 *
 * @param {Element} el
 * @return {Object}
 * @api private
 */

function offset(el) {
  var left = 0;
  var top = 0;

  while (el) {
    left += el.offsetLeft;
    top += el.offsetTop;
    el = el.offsetParent;
  }

  return { left: left, top: top };
}
module.exports = exports['default'];


},{}]},{},[1]);
