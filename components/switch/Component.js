"use strict";

class Switch extends AbstractComponent{
  constructor(options){
    super();
    var elId = options.id;
    this._el = document.getElementById(elId)||options.el;
    if (this._el === null) return;
    this._create();
  }

  _create(){
    this._el.innerHTML=
      '<input type="checkbox" name="switch" class="switch-checkbox" id="'+this._el.id+'_checkbox" checked> </input>'+
      '<label class="switch-label" for="'+this._el.id+'_checkbox">'+
       '<span class="switch-inner"></span>'+
       '<span class="switch-switch"></span>'+
      '</label>';
      this._checkbox=document.getElementById(this._el.id+"_checkbox");
    }

    get value(){
      return this._checkbox.checked;
    }
}