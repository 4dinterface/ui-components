"use strict";
class Circles extends AbstractComponent{
  constructor(options){
    super();
    var elId = options.id;
    this._el = document.getElementById(elId);

    this._el.className=this._el.className+" circle-input"

    if (this._el === null) return;

    this._radius         = options.radius || 10;

    this._strokeWidth    = options.width  || 10;
    this._colors         = options.colors || ['rgb(75,75,75)', 'rgb(124,255,226)'];
    this._svg            = null;
    this._movingPath     = null;
    this._wrapContainer  = null;
    this._textContainer  = null;

    this._wrpClass       = options.wrpClass || 'circles-wrp';
    this._textClass      = options.textClass || 'circles-text';

    this._valClass       = options.valueStrokeClass || 'circles-valueStroke';
    this._maxValClass    = options.maxValueStrokeClass || 'circles-maxValueStroke';

    this._styleWrapper   = options.styleWrapper === false ? false : true;

    var endAngleRad      = Math.PI / 180 * 270;
    this._start          = -Math.PI / 180 * 90;
    this._startPrecise   = this._precise(this._start);
    this._circ           = endAngleRad - this._start;

    this._create();
    this._maxValue       = options.maxValue || 100;

    this.value=  options.value;
  }

  get value(){
    return this._value;
  }

  set value(value){
    if(this._value==value) return;
    if(this._value>this._maxValue) value=this._maxValue;
    if(this._value<0 || isNaN(value)) value=0;

    this._value=value;
    this._movingPath.setAttribute('d', this._calculatePath(value, true));
    this._textContainer.value	= value;	//this._getText(this.getValueFromPercent(value));
    this.fire("change",{});
  }

  get maxValue(){
    return this._maxValue;
  }

  /**
   *
   * @returns {Circles}
   * @private
   */
  _create() {
    this._svgSize        = this._radius * 2;
    this._radiusAdjusted = this._radius - (this._strokeWidth / 2);

    this._createSvg();
    this._createInput();
    this._createWrapper();

    this._el.innerHTML = '';
    this._el.appendChild(this._wrapContainer);
  }

  _createWrapper() {
    this._wrapContainer	=	document.createElement('div');
    this._wrapContainer.className = this._wrpClass;

    if (this._styleWrapper) {
      this._wrapContainer.style.position	=	'relative';
      this._wrapContainer.style.display	=	'inline-block';
    }

    this._wrapContainer.appendChild(this._svg);
    this._wrapContainer.appendChild(this._textContainer);


    return this;
  }

  wheel(event){
    var delta=0;
    // IE, Opera, safari, chrome - wheelDelta
    // Mozilla, detail
    delta = (event.wheelDelta)?-event.wheelDelta/120:event.detail/3;

    if(delta>0) this.value++;
    if(delta<0) this.value--;
    event.preventDefault();
  }

  _createInput() {
    this._textContainer = document.createElement("input");
    this._textContainer.setAttribute("type","number");
    this._textContainer.className = this._textClass;

    var style	=	{
      position:   'absolute',
      top:        0,
      left:       0,
      textAlign:  'center',
      width:      '100%',
      height:     this._svgSize + 'px',
      lineHeight: this._svgSize + 'px',
      background:"transparent",
      border:"none"
    };

    this._textContainer.addEventListener("keyup",(e)=>this.value=parseInt(this._textContainer.value));
    this._textContainer.addEventListener("change",(e)=>this.value=parseInt(this._textContainer.value));
    this._textContainer.addEventListener('mousewheel', this.wheel.bind(this));

    //this._textContainer.addEventListener('click', (e)=>this.value++);
    this._textContainer.addEventListener('mouseup', (e)=>{
        
    });

    for(var prop in style) {
      this._textContainer.style[prop]	=	style[prop];
    }
    return this;
  }

  _createSvg() {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this._svg.setAttribute('width', this._svgSize);
    this._svg.setAttribute('height', this._svgSize);

    this._createPath(100, false, this._colors[0], this._maxValClass)._createPath(1, true, this._colors[1], this._valClass);

    this._movingPath = this._svg.getElementsByTagName('path')[1];

    return this;
  }

  _createPath(percentage, open, color, pathClass) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', this._strokeWidth);
    path.setAttribute('d',  this._calculatePath(percentage, open));
    path.setAttribute('class', pathClass);

    this._svg.appendChild(path);

    return this;
  }

  _calculatePath(percentage, open) {
    var end      = this._start + ((percentage / 100) * this._circ),
        endPrecise = this._precise(end);
    return this._arc(endPrecise, open);
  }

  _arc(end, open) {
    var endAdjusted = end - 0.001,
        longArc       = end - this._startPrecise < Math.PI ? 0 : 1;

    return [
      'M',
      this._radius + this._radiusAdjusted * Math.cos(this._startPrecise),
      this._radius + this._radiusAdjusted * Math.sin(this._startPrecise),
      'A', // arcTo
      this._radiusAdjusted, // x radius
      this._radiusAdjusted, // y radius
      0, // slanting
      longArc, // long or short arc
      1, // clockwise
      this._radius + this._radiusAdjusted * Math.cos(endAdjusted),
      this._radius + this._radiusAdjusted * Math.sin(endAdjusted),
      open ? '' : 'Z' // close
    ].join(' ');
  }

  _precise(value) {
    return Math.round(value * 1000) / 1000;
  }

  /*========================================= Public API =========================================================*/
  getPercent() {
    return (this._value * 100) / this._maxValue;
  }

  getValueFromPercent(percentage){
    return (this._maxValue * percentage) / 100;
  }

  static create(options){
    return new Circles(options);
  }
}