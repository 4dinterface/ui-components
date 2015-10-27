"use strict";

class Circles extends AbstractComponent{

  constructor(options){
    super();
    var elId = options.id;
    this._el = document.getElementById(elId);

    this._el.className=this._el.className+" circle-input"

    if (this._el === null) return;

    this._radius         = options.radius || 60;

    this._strokeWidth    = options.width  || 10;
    this._colors         = options.colors || ['rgb(75,75,75)', 'rgb(124,255,226)'];
    this._svg            = null;
    this._movingPath     = null;
    this._wrapContainer  = null;
    this._input  = null;

    this._wrpClass       = options.wrpClass || 'circles-wrp';
    this._inputClass     = options.inputClass || 'circles-input';

    this._valClass       = options.valueStrokeClass || 'circles-valueStroke';
    this._maxValClass    = options.maxValueStrokeClass || 'circles-maxValueStroke';

    var endAngleRad      = Math.PI / 180 * 270;
    this._start          = -Math.PI / 180 * 90;
    this._startPrecise   = this._precise(this._start);
    this._circ           = endAngleRad - this._start;

    this._maxValue       = options.maxValue || 100;

    this._onMove=this._onMove.bind(this);
    this._onUp=this._onUp.bind(this);
    this._onDown=this._onDown.bind(this);
    this._create();

    this.value=  options.value;
  }

  /**
   * @private
   */
  _create() {
    this._svgSize        = this._radius * 2;
    this._radiusAdjusted = this._radius - (this._strokeWidth / 2);

    this._el.style.width=this._svgSize+"px";
    this._el.style.height=this._svgSize+"px";

    this._createSvg();
    this._createInput();
    this._createHelper();
    this._createWrapper();

    this._el.innerHTML = '';
    this._el.appendChild(this._wrapContainer);
  }

  _createWrapper() {
    this._wrapContainer	=	document.createElement('div');
    this._wrapContainer.className = this._wrpClass;

    this._wrapContainer.style.position	=	'relative';
    this._wrapContainer.style.display	=	'inline-block';

    this._wrapContainer.appendChild(this._svg);
    this._wrapContainer.appendChild(this._input);
    this._wrapContainer.appendChild(this._helper);

    return this;
  }

  _createInput() {
    this._input = document.createElement("input");
    this._input.setAttribute("type", "number");
    this._input.className = this._inputClass;

    this._input.addEventListener("keydown",(e)=>{

      if(e.keyCode==38) {
        this.value++;
        e.preventDefault();
      }
      if(e.keyCode==40) {
        this.value--;
        e.preventDefault();
      }
      //this._helper.style.opacity=0;
    });

    this._input.addEventListener("keypress",(e)=>{
      if(e.keyCode<47 || e.keyCode>57  ) e.preventDefault();
    });

    this._input.addEventListener("keyup",(e)=>{
      this.value=parseInt(this._input.value);
    });
    this._input.addEventListener("change",(e)=>this.value=parseInt(this._input.value));

    this._input.addEventListener('mousewheel', this.wheel.bind(this));
    this._input.addEventListener('DOMMouseScroll', this.wheel.bind(this));

    this._input.addEventListener('click', (e)=>this.value++);

    this._input.addEventListener('touchmove', this._onMove.bind(this));
    this._input.addEventListener('mousedown', this._onDown);

    return this;
  }

  _createHelper(){
    this._helper = document.createElement("div");
    this._helper.style.position="absolute";
    this._helper.className="helper";
    this._helper.innerHTML="%";
  }

  _createSvg() {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this._svg.setAttribute('width', this._svgSize);
    this._svg.setAttribute('height', this._svgSize);

    this._createPath(100, false, this._colors[0], this._maxValClass);
    this._createPath(1, true, this._colors[1], this._valClass);

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
  };



  wheel(event){
    var delta=0;
    delta = (event.wheelDelta)?-event.wheelDelta/120:event.detail/3;

    if(delta>0) this.value=this.value+1;
    if(delta<0) this.value=this.value-1;

    if(this._timeout) this._timeout=clearTimeout(this._timeout);
    if(Math.abs(delta)>0.3) this._inertia(delta,100);
    event.preventDefault();
  }

  _inertia(delta,time){
    if(delta>0) this.value=this.value+1;
    if(delta<0) this.value=this.value-1;
    time=time*1.1; //�������� ���������� �� 10% �� ���.

    //������������ �������� 180
    if(time<180) this._timeout=setTimeout(this._inertia.bind(this,delta,time),time)
    console.log(delta);
  }
  _onDown(event){
    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mouseup', this._onUp);
  }

  _onUp(){
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onUp);
  }

  _onMove(event){
    var e=event.changedTouches?event.changedTouches[0]:event,
        boundRect=this._el.getBoundingClientRect(),
        centerX=boundRect.left+boundRect.width/2,
        centerY=boundRect.top+boundRect.height/2,
        x=e.clientX-centerX,
        y=e.clientY-centerY,
        rad=Math.atan2(x,y);

    if(rad>this._rad && rad<3.14 ){
      this.value--;
    } else {
      this.value++;
    }
    this._rad=rad
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
  get value(){
    return this._value;
  }

  set value(value){
    // this._helper.style.opacity=1;
    if(this._value==value) return;
    if(value>this._maxValue) value=this._maxValue;
    if(value<0 || isNaN(value)) value=0;

    this._value=value;
    this._movingPath.setAttribute('d', this._calculatePath(value, true));
    this._input.value	= value;	//this._getText(this.getValueFromPercent(value));

    var width=this._input.value.toString().length*10,
        start=50;

    this._input.style.paddingLeft=(start-width)+"px";
    this._helper.style.left=(start+6+width)+"px";

    this.fire("change",{});
  }


  get maxValue(){
    return this._maxValue;
  }

  static create(options){
    return new Circles(options);
  }
}