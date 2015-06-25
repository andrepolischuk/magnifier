
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
    this.className = 'magnifier';
    insertAfter(this.lens, this.el);
    this.move = this.onmove.bind(this);
    this.show();
    this.getImageSize();
    this.bind();
  }

  getImageSize() {
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
    event = event.type === 'touchmove' ? event.changedTouches[0] : event;
    const {pageX, pageY} = event;
    const {left, top} = offset(this.el);

    if (!isInside(this.el, event)) return this.hide();
    this.show();

    const ratioX = this.imageWidth / this.el.offsetWidth;
    const ratioY = this.imageHeight / this.el.offsetHeight;
    const imageX = (left - pageX) * ratioX + this.lens.offsetWidth / 2;
    const imageY = (top - pageY) * ratioY + this.lens.offsetHeight / 2;
    let x = pageX - this.lens.offsetWidth / 2;
    let y = pageY - this.lens.offsetHeight / 2;

    if (!isStatic(this.el)) {
      x -= left - this.el.offsetLeft;
      y -= top - this.el.offsetTop;
    }

    this.lens.style.left = `${x}px`;
    this.lens.style.top = `${y}px`;
    this.lens.style.backgroundPosition = `${imageX}px ${imageY}px`;
  }

  bind() {
    this.el.addEventListener('mousemove', this.move, false);
    this.el.addEventListener('touchmove', this.move, false);
    this.lens.addEventListener('mousemove', this.move, false);
    this.lens.addEventListener('touchmove', this.move, false);
    return this;
  }

  unbind() {
    this.el.removeEventListener('mousemove', this.move, false);
    this.el.removeEventListener('touchmove', this.move, false);
    this.lens.removeEventListener('mousemove', this.move, false);
    this.lens.removeEventListener('touchmove', this.move, false);
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

/**
 * Insert after
 *
 * @param {Element} el
 * @param {Element} ref
 * @return {Element}
 * @api private
 */

function insertAfter(el, ref) {
  const parent = ref.parentNode;
  let next = ref.nextSibling;
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
  const {pageX, pageY} = event;
  const {left, top} = offset(el);
  const {offsetWidth, offsetHeight} = el;
  return pageX >= left && pageX <= left + offsetWidth &&
    pageY >= top && pageY <= top + offsetHeight;
}

/**
 * Detect element is static
 *
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

function isStatic(el) {
  const {left, top} = offset(el);
  const {offsetLeft, offsetTop} = el;
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
  let left = 0;
  let top = 0;

  while(el) {
    left += el.offsetLeft;
    top += el.offsetTop;
    el = el.offsetParent;
  }

  return {left, top};
}
