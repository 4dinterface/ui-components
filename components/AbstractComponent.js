"use strict";

class AbstractComponent{
  on(name,fn){
    this._el.addEventListener(name,fn)
  }

  off(name,fn){
    this._el.removeEventListener(name,fn)
  }

  fire(name,options){
    var e_onchange = document.createEvent("Event");
    e_onchange.initEvent(name, false, true);
    this._el.dispatchEvent(e_onchange);
  }

  async(fn, context){
    if(context) fn=fn.bind(context);
    setTimeout(fn, 1);
  }
}