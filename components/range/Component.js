"use strict";

class Range extends AbstractComponent {
  /**
   *
   * @param options
   */
  constructor(options) {
    super();
    var elId = options.id;
    this._el = document.getElementById(elId) || options.el;
    this._el.style.position = "relative"; // TODO заменить враппером
    if (this._el === null) return;
    this._el.className = this._el.className ? +" " : "" + "range-component"

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);

    this._el.addEventListener("touchmove", this._onMouseMove);


    this._headerWidth = 20;
    this._create();
    this._value = 0;
  }

  /**
   *
   * @private
   */
  _create() {
    this._zone = document.createElement('div');
    this._zone.className = "zone"
    this._el.appendChild(this._zone);

    this._header = document.createElement('div');
    this._header.className = "header"
    this._el.appendChild(this._header);

    this._pointHeader = document.createElement('div');
    this._pointHeader.className = "point-header"
    this._header.appendChild(this._pointHeader);

    this._header.addEventListener("mousedown", this._onMouseDown);
  }

  /**
   *
   * @returns {number}
   */
  get value() {
    return Math.round(this._value);
  }

  /**
   *
   * @param value {*}
   */
  set value(value) {
    this._value = value;
    this.fire("change", {});
  }

  /**
   *
   * @private
   */
  _onMouseDown() {
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
  }

  /**
   *
   * @param event
   * @private
   */
  _onMouseMove(event) {
    var e = event.changedTouches ? event.changedTouches[0] : event,
        boundRect = this._el.getBoundingClientRect(),
        pos = e.pageX - boundRect.left - 10;

    if (pos > this._el.offsetWidth - this._headerWidth) pos = this._el.offsetWidth - this._headerWidth;
    if (pos < 0) pos = 0;
    this._update(pos); //TODO перенести в value

    this.value = 100 / (this._el.offsetWidth - this._header.offsetWidth) * pos;

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   *
   * @param e
   * @private
   */
  _onMouseUp(e) {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
  }

  /**
   *
   * @param pos
   * @private
   */
  _update(pos) {
    this._header.style.marginLeft = (pos) + "px";
    this._zone.style.left = (pos + 10) + "px";
  }

}