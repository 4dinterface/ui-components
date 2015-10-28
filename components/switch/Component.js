"use strict";

class Switch extends AbstractComponent{
  constructor(options){
    super();
    var elId = options.id;
    this._el = document.getElementById(elId)||options.el;
    if (this._el === null) return;
    this._create();

    this._onMove=this._onMove.bind(this);
    this._onUp=this._onUp.bind(this);
    this._onDown=this._onDown.bind(this)

    this._el.addEventListener("mousedown",this._onDown);

    this._el.addEventListener("touchstart",this._onDown);
    this._el.addEventListener("touchmove",this._onMove);
    this._el.addEventListener("touchend",this._onUp);
  }

  _onDown(event){
    var e=event.changedTouches?event.changedTouches[0]:event;
    this.startX=e.clientX;
    this.mouseDownX=e.clientX;
    document.addEventListener("mousemove",this._onMove);
    document.addEventListener("mouseup",this._onUp);

  }

  _onUp(event){
    console.log(event);

    var e=event.changedTouches?event.changedTouches[0]:event;
    this._switchHeader.style.transform="translateX(0px)";
    if(this.mouseDownX == e.clientX) this.switch();

    document.removeEventListener("mousemove",this._onMove);
    document.removeEventListener("mouseup",this._onUp);
    event.preventDefault();
    event.stopPropagation();
  }

  _onMove(event){
    var e=event.changedTouches?event.changedTouches[0]:event,
        offsetX = e.clientX-this.startX;

    if(this._input.checked && offsetX>0) offsetX=0;
    if(!this._input.checked && offsetX<0) offsetX=0;

    this._switchHeader.style.transform="translateX("+(offsetX)+"px)";

    if(offsetX<-30){
      this.startX=e.clientX;
      this.switch();
    }

    if(offsetX>30){
      this.startX=e.clientX;
      this.switch();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  _create(){
    this._el.innerHTML=
      '<input type="checkbox" name="switch" class="switch-checkbox" id="'+this._el.id+'_checkbox" checked> </input>'+
      '<label class="switch-label" for="'+this._el.id+'_checkbox_">'+
       '<span class="switch-inner"></span>'+
       '<span class="switch-switch"></span>'+
      '</label>';

    this._checkbox=document.getElementById(this._el.id+"_checkbox");
    this._switchHeader=this._el.getElementsByClassName('switch-switch')[0];
    this._input=this._el.getElementsByTagName('input')[0];
  }

  get value(){
    return this._checkbox.checked;
  }

  set value(value){
    if(value) this._input.setAttribute("checked","true");
    else this._input.removeAttribute("checked");
    this.fire("change",{})
  }

  switch(){
    this.value=!this._input.checked;
    this._switchHeader.style.transform="translateX(0px)";
  }

}