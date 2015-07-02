
/**
 * Module dependencies
 */

import offset from 'global-offset';
import isPointerInside from 'is-pointer-inside';

/**
 * Expose magnifier
 *
 * @param {Element} el
 * @api public
 */

export default class Magnifier {
  constructor(el) {
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
    this.events = {};
    this.events.onmove = this.onmove.bind(this);
    this.events.onend = this.hide.bind(this);
    this.bind();
  }

  append() {
    const parent = this.el.parentNode;
    let next = this.el.nextSibling;
    while (next && next.nodeType > 1) next = next.nextSibling;
    if (!next) return parent.appendChild(this.lens);
    return parent.insertBefore(this.lens, next);
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

  onmove(event) {
    event.preventDefault();
    event = event.type.indexOf('touch') === 0 ? event.changedTouches[0] : event;

    if (!isPointerInside(this.el, event)) return this.hide();
    this.show();

    const {pageX, pageY} = event;
    const {left, top} = offset(this.el);
    const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.el;
    const lensWidth = this.lens.offsetWidth;
    const lensHeight = this.lens.offsetHeight;
    const ratioX = this.imageWidth / offsetWidth;
    const ratioY = this.imageHeight / offsetHeight;
    const imageX = (left - pageX) * ratioX + lensWidth / 2 - 2;
    const imageY = (top - pageY) * ratioY + lensHeight / 2 - 2;
    const x = pageX - lensWidth / 2 - (left !== offsetLeft ? left - offsetLeft : 0);
    const y = pageY - lensHeight / 2 - (top !== offsetTop ? top - offsetTop : 0);

    this.lens.style.left = `${x}px`;
    this.lens.style.top = `${y}px`;
    this.lens.style.backgroundPosition = `${imageX}px ${imageY}px`;
  }

  bind() {
    this.el.addEventListener('touchstart', this.events.onmove, false);
    this.el.addEventListener('mousemove', this.events.onmove, false);
    this.el.addEventListener('touchmove', this.events.onmove, false);
    this.el.addEventListener('touchend', this.events.onend, false);
    this.lens.addEventListener('mousemove', this.events.onmove, false);
    this.lens.addEventListener('touchmove', this.events.onmove, false);
    this.lens.addEventListener('touchend', this.events.onend, false);
    return this;
  }

  unbind() {
    this.el.removeEventListener('touchstart', this.events.onmove, false);
    this.el.removeEventListener('mousemove', this.events.onmove, false);
    this.el.removeEventListener('touchmove', this.events.onmove, false);
    this.el.removeEventListener('touchend', this.events.onend, false);
    this.lens.removeEventListener('mousemove', this.events.onmove, false);
    this.lens.removeEventListener('touchmove', this.events.onmove, false);
    this.lens.removeEventListener('touchend', this.events.onend, false);
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
