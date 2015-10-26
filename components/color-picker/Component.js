"use strict";

class ColorPicker extends AbstractComponent{

  constructor(options){
    super();
    var elId = options.id;
    this._el = document.getElementById(elId)||options.el;
    this._el.style.position="relative";// TODO заменить враппером
    this._el.className="color-picker";
    if (this._el === null) return;

    this._widthBorder=8;
    this._width=107;
    this._height=107;

    this._el.style.width=this._width+"px";
    this._el.style.height=this._height+"px";

    this._create();
    this._el.addEventListener("mousemove",this._onMove.bind(this))
    this._el.addEventListener("mousedown",this._setColor.bind(this))

    this._currentX=51;
    this._currentY=51;
    this._color="#00CEFF";
  }

  _create(){
    this.canvas=document.createElement('canvas');
    this.canvas.width=this._width;
    this.canvas.height=this._height;
    this.canvas.id="picker";
    this._el.appendChild(this.canvas);
    this.ctx=this.canvas.getContext("2d");

    this._selector=document.createElement('div');
    this._selector.className="selector";
    this._selector.style.width=5+"px";
    this._selector.style.height=5+"px";
    this._selector.style.position="absolute";
    this._selector.style.left=60+"px";
    this._selector.style.top=60+"px";
    this._el.appendChild(this._selector);

    this._face=document.createElement('div');
    this._face.style.width="100%";
    this._face.style.height="100%";
    this._face.style.position="absolute";
    this._face.style.left=0+"px";
    this._face.style.top=0+"px";
    this._el.appendChild(this._face);

    var image = new Image();
    image.onload =()=>this.ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    image.src="components/color-picker/color-wheel.png";
  }

  get value(){
    return this._color;
  }

  _setColor(e){
    var imageData = this.ctx.getImageData(this._currentX, this._currentY, 1, 1),
        pixel = imageData.data,
        red=pixel[0].toString(16),
        green=pixel[1].toString(16),
        blue=pixel[2].toString(16);

    this._selector.style.left=(this._currentX-2)+this.canvas.offsetLeft+"px";
    this._selector.style.top=(this._currentY-2)+this.canvas.offsetTop+"px";

    this._color="#"+(red.length<2?"0"+red:red);
    this._color+=green.length<2?"0"+green:green;
    this._color+=blue.length<2?"0"+blue:blue;
    this.fire("change",{});

    console.log(this._color);
  }

  _onMove(e){
    var canvasX = Math.floor(e.offsetX)-this.canvas.offsetLeft,
        canvasY = Math.floor(e.offsetY)-this.canvas.offsetTop,
        imageData = this.ctx.getImageData(canvasX, canvasY, 1, 1);

    if(imageData.data[3]==0) return;
    this._currentX=canvasX;
    this._currentY=canvasY;
    if(e.buttons==1) this._setColor(e);
  }


}