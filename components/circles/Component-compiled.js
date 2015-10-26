"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circles = (function (_AbstractComponent) {
  _inherits(Circles, _AbstractComponent);

  function Circles(options) {
    _classCallCheck(this, Circles);

    _get(Object.getPrototypeOf(Circles.prototype), "constructor", this).call(this);
    var elId = options.id;
    this._el = document.getElementById(elId);

    this._el.className = this._el.className + " circle-input";

    if (this._el === null) return;

    this._radius = options.radius || 10;

    this._strokeWidth = options.width || 10;
    this._colors = options.colors || ['rgb(75,75,75)', 'rgb(124,255,226)'];
    this._svg = null;
    this._movingPath = null;
    this._wrapContainer = null;
    this._textContainer = null;

    this._wrpClass = options.wrpClass || 'circles-wrp';
    this._textClass = options.textClass || 'circles-text';

    this._valClass = options.valueStrokeClass || 'circles-valueStroke';
    this._maxValClass = options.maxValueStrokeClass || 'circles-maxValueStroke';

    this._styleWrapper = options.styleWrapper === false ? false : true;

    var endAngleRad = Math.PI / 180 * 270;
    this._start = -Math.PI / 180 * 90;
    this._startPrecise = this._precise(this._start);
    this._circ = endAngleRad - this._start;

    this._create();
    this._maxValue = options.maxValue || 100;

    this.value = options.value;
  }

  _createClass(Circles, [{
    key: "_create",

    /**
     *
     * @returns {Circles}
     * @private
     */
    value: function _create() {
      this._svgSize = this._radius * 2;
      this._radiusAdjusted = this._radius - this._strokeWidth / 2;

      this._createSvg();
      this._createInput();
      this._createWrapper();

      this._el.innerHTML = '';
      this._el.appendChild(this._wrapContainer);
    }
  }, {
    key: "_createWrapper",
    value: function _createWrapper() {
      this._wrapContainer = document.createElement('div');
      this._wrapContainer.className = this._wrpClass;

      if (this._styleWrapper) {
        this._wrapContainer.style.position = 'relative';
        this._wrapContainer.style.display = 'inline-block';
      }

      this._wrapContainer.appendChild(this._svg);
      this._wrapContainer.appendChild(this._textContainer);

      return this;
    }
  }, {
    key: "wheel",
    value: function wheel(event) {
      var delta = 0;
      // IE, Opera, safari, chrome - wheelDelta
      // Mozilla, detail
      delta = event.wheelDelta ? -event.wheelDelta / 120 : event.detail / 3;

      if (delta > 0) this.value++;
      if (delta < 0) this.value--;
      event.preventDefault();
    }
  }, {
    key: "_createInput",
    value: function _createInput() {
      var _this = this;

      this._textContainer = document.createElement("input");
      this._textContainer.setAttribute("type", "number");
      this._textContainer.className = this._textClass;

      var style = {
        position: 'absolute',
        top: 0,
        left: 0,
        textAlign: 'center',
        width: '100%',
        height: this._svgSize + 'px',
        lineHeight: this._svgSize + 'px',
        background: "transparent",
        border: "none"
      };

      this._textContainer.addEventListener("keyup", function (e) {
        return _this.value = parseInt(_this._textContainer.value);
      });
      this._textContainer.addEventListener("change", function (e) {
        return _this.value = parseInt(_this._textContainer.value);
      });
      this._textContainer.addEventListener('mousewheel', this.wheel.bind(this));

      //this._textContainer.addEventListener('click', (e)=>this.value++);
      this._textContainer.addEventListener('mouseup', function (e) {});

      for (var prop in style) {
        this._textContainer.style[prop] = style[prop];
      }
      return this;
    }
  }, {
    key: "_createSvg",
    value: function _createSvg() {
      this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this._svg.setAttribute('width', this._svgSize);
      this._svg.setAttribute('height', this._svgSize);

      this._createPath(100, false, this._colors[0], this._maxValClass)._createPath(1, true, this._colors[1], this._valClass);

      this._movingPath = this._svg.getElementsByTagName('path')[1];

      return this;
    }
  }, {
    key: "_createPath",
    value: function _createPath(percentage, open, color, pathClass) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'transparent');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', this._strokeWidth);
      path.setAttribute('d', this._calculatePath(percentage, open));
      path.setAttribute('class', pathClass);

      this._svg.appendChild(path);

      return this;
    }
  }, {
    key: "_calculatePath",
    value: function _calculatePath(percentage, open) {
      var end = this._start + percentage / 100 * this._circ,
          endPrecise = this._precise(end);
      return this._arc(endPrecise, open);
    }
  }, {
    key: "_arc",
    value: function _arc(end, open) {
      var endAdjusted = end - 0.001,
          longArc = end - this._startPrecise < Math.PI ? 0 : 1;

      return ['M', this._radius + this._radiusAdjusted * Math.cos(this._startPrecise), this._radius + this._radiusAdjusted * Math.sin(this._startPrecise), 'A', // arcTo
      this._radiusAdjusted, // x radius
      this._radiusAdjusted, // y radius
      0, // slanting
      longArc, // long or short arc
      1, // clockwise
      this._radius + this._radiusAdjusted * Math.cos(endAdjusted), this._radius + this._radiusAdjusted * Math.sin(endAdjusted), open ? '' : 'Z' // close
      ].join(' ');
    }
  }, {
    key: "_precise",
    value: function _precise(value) {
      return Math.round(value * 1000) / 1000;
    }

    /*========================================= Public API =========================================================*/
  }, {
    key: "getPercent",
    value: function getPercent() {
      return this._value * 100 / this._maxValue;
    }
  }, {
    key: "getValueFromPercent",
    value: function getValueFromPercent(percentage) {
      return this._maxValue * percentage / 100;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      if (this._value == value) return;
      if (this._value > this._maxValue) value = this._maxValue;
      if (this._value < 0 || isNaN(value)) value = 0;

      this._value = value;
      this._movingPath.setAttribute('d', this._calculatePath(value, true));
      this._textContainer.value = value; //this._getText(this.getValueFromPercent(value));
      this.fire("change", {});
    }
  }, {
    key: "maxValue",
    get: function get() {
      return this._maxValue;
    }
  }], [{
    key: "create",
    value: function create(options) {
      return new Circles(options);
    }
  }]);

  return Circles;
})(AbstractComponent);

//# sourceMappingURL=Component-compiled.js.map