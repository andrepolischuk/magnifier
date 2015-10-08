import autobind from 'autobind-decorator';
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
    if (typeof el === 'string') el = document.querySelector(el);
    this.el = el;
    this.lens = document.createElement('div');
    this.lens.style.position = 'absolute';
    this.lens.style.backgroundRepeat = 'no-repeat';
    this.lens.style.borderStyle = 'solid';
    this.lens.style.overflow = 'hidden';
    this.lens.style.visibility = 'hidden';
    Object.keys(this.props).forEach(prop => this.setStyle(prop, this.props[prop]));
    this.lens.className = 'magnifier';
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

    orig.onload = () => {
      this.imageWidth = orig.offsetWidth;
      this.imageHeight = orig.offsetHeight;
      orig.parentNode.removeChild(orig);
      this.hide();
      this.lens.style.visibility = 'visible';
      this.lens.style.backgroundImage = `url(${this.el.src})`;
    };

    this.lens.appendChild(orig);
  }

  @autobind
  onmove(event) {
    event.preventDefault();
    event = event.type.indexOf('touch') === 0 ? event.changedTouches[0] : event;
    if (!isPointerInside(this.el, event)) return this.hide();
    this.show();
    const {pageX, pageY} = event;
    const {left, top} = offset(this.el);
    const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.el;
    const {width, height, borderWidth} = this.props;
    const ratioX = this.imageWidth / offsetWidth;
    const ratioY = this.imageHeight / offsetHeight;
    const imageX = (left - pageX) * ratioX + width / 2 - borderWidth;
    const imageY = (top - pageY) * ratioY + height / 2 - borderWidth;
    const x = pageX - width / 2 - (left !== offsetLeft ? left - offsetLeft : 0);
    const y = pageY - height / 2 - (top !== offsetTop ? top - offsetTop : 0);
    this.lens.style.left = `${x}px`;
    this.lens.style.top = `${y}px`;
    this.lens.style.backgroundPosition = `${imageX}px ${imageY}px`;
  }

  @autobind
  onend() {
    this.hide();
  }

  bind() {
    this.el.addEventListener('mousemove', this.onmove, false);
    this.el.addEventListener('mouseleave', this.onend, false);
    this.el.addEventListener('touchstart', this.onmove, false);
    this.el.addEventListener('touchmove', this.onmove, false);
    this.el.addEventListener('touchend', this.onend, false);
    this.lens.addEventListener('mousemove', this.onmove, false);
    this.lens.addEventListener('mouseleave', this.onend, false);
    this.lens.addEventListener('touchmove', this.onmove, false);
    this.lens.addEventListener('touchend', this.onend, false);
    return this;
  }

  unbind() {
    this.el.removeEventListener('mousemove', this.onmove, false);
    this.el.removeEventListener('mouseleave', this.onend, false);
    this.el.removeEventListener('touchstart', this.onmove, false);
    this.el.removeEventListener('touchmove', this.onmove, false);
    this.el.removeEventListener('touchend', this.onend, false);
    this.lens.removeEventListener('mousemove', this.onmove, false);
    this.lens.removeEventListener('mouseleave', this.onend, false);
    this.lens.removeEventListener('touchmove', this.onmove, false);
    this.lens.removeEventListener('touchend', this.onend, false);
    return this;
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
}
