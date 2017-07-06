/* global document */
import offset from 'global-offset';
import insertAfter from 'insert-after';
import isPointerInside from 'is-pointer-inside';

export default class Magnifier {
  props = {
    height: 150,
    width: 150,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderRadius: 75,
    borderWidth: 2
  };

  constructor(el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.lens = document.createElement('div');
    this.lens.className = 'magnifier';
    this.lens.style.position = 'absolute';
    this.lens.style.backgroundRepeat = 'no-repeat';
    this.lens.style.borderStyle = 'solid';
    this.lens.style.overflow = 'hidden';
    this.lens.style.visibility = 'hidden';
    this.lens.style.boxShadow = '0 1px 5px rgba(0, 0, 0, .25)';
    this.handleLoad = this.handleLoad.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    Object.keys(this.props).forEach(prop => this.setStyle(prop, this.props[prop]));
    insertAfter(this.lens, this.el);
    this.show();
    this.calcImageSize();
    this.bind();
  }

  calcImageSize() {
    const orig = document.createElement('img');
    orig.style.position = 'absolute';
    orig.style.width = 'auto';
    orig.style.visibility = 'hidden';
    orig.src = this.el.src;
    orig.onload = this.handleLoad;
    this.lens.appendChild(orig);
  }

  bind() {
    this.el.addEventListener('mousemove', this.handleTouchMove, false);
    this.el.addEventListener('mouseleave', this.handleTouchEnd, false);
    this.el.addEventListener('touchstart', this.handleTouchMove, false);
    this.el.addEventListener('touchmove', this.handleTouchMove, false);
    this.el.addEventListener('touchend', this.handleTouchEnd, false);
    this.lens.addEventListener('mousemove', this.handleTouchMove, false);
    this.lens.addEventListener('mouseleave', this.handleTouchEnd, false);
    this.lens.addEventListener('touchmove', this.handleTouchMove, false);
    this.lens.addEventListener('touchend', this.handleTouchEnd, false);
    return this;
  }

  unbind() {
    this.el.removeEventListener('mousemove', this.handleTouchMove, false);
    this.el.removeEventListener('mouseleave', this.handleTouchEnd, false);
    this.el.removeEventListener('touchstart', this.handleTouchMove, false);
    this.el.removeEventListener('touchmove', this.handleTouchMove, false);
    this.el.removeEventListener('touchend', this.handleTouchEnd, false);
    this.lens.removeEventListener('mousemove', this.handleTouchMove, false);
    this.lens.removeEventListener('mouseleave', this.handleTouchEnd, false);
    this.lens.removeEventListener('touchmove', this.handleTouchMove, false);
    this.lens.removeEventListener('touchend', this.handleTouchEnd, false);
    return this;
  }

  handleLoad() {
    const orig = this.lens.getElementsByTagName('img')[0];
    this.imageWidth = orig.offsetWidth;
    this.imageHeight = orig.offsetHeight;
    this.hide();
    this.lens.style.visibility = 'visible';
    this.lens.style.backgroundImage = `url(${this.el.src})`;
    this.lens.removeChild(orig);
  }

  handleTouchMove(event) {
    event.preventDefault();
    const touch = event.type.indexOf('touch') === 0 ? event.changedTouches[0] : event;

    if (isPointerInside(this.el, touch)) {
      this.show();
      const { pageX, pageY } = touch;
      const { left, top } = offset(this.el);
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = this.el;
      const { width, height, borderWidth } = this.props;
      const ratioX = this.imageWidth / offsetWidth;
      const ratioY = this.imageHeight / offsetHeight;
      const imageX = ((left - pageX) * ratioX) + ((width / 2) - borderWidth);
      const imageY = ((top - pageY) * ratioY) + ((height / 2) - borderWidth);
      const x = pageX - (width / 2) - (left !== offsetLeft ? left - offsetLeft : 0);
      const y = pageY - (height / 2) - (top !== offsetTop ? top - offsetTop : 0);
      this.lens.style.left = `${x}px`;
      this.lens.style.top = `${y}px`;
      this.lens.style.backgroundPosition = `${imageX}px ${imageY}px`;
    } else {
      this.hide();
    }
  }

  handleTouchEnd() {
    this.hide();
  }

  height(n) {
    return this.setProp('height', n);
  }

  width(n) {
    return this.setProp('width', n);
  }

  backgroundColor(color) {
    return this.setProp('backgroundColor', color);
  }

  borderColor(color) {
    return this.setProp('borderColor', color);
  }

  borderRadius(n) {
    return this.setProp('borderRadius', n);
  }

  borderWidth(n) {
    return this.setProp('borderWidth', n);
  }

  setProp(prop, value) {
    this.props[prop] = value;
    this.setStyle(prop, value);
    return this;
  }

  setStyle(prop, value) {
    this.lens.style[prop] = typeof value === 'number' ? `${value}px` : value;
  }

  className(name) {
    this.lens.className = name;
    return this;
  }

  show() {
    this.lens.style.display = 'block';
    return this;
  }

  hide() {
    this.lens.style.display = 'none';
    return this;
  }

  destroy() {
    this.unbind();
    this.lens.remove();
  }
}
