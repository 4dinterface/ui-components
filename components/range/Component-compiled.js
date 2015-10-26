"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Range = (function (_AbstractComponent) {
  _inherits(Range, _AbstractComponent);

  function Range(options) {
    _classCallCheck(this, Range);

    _get(Object.getPrototypeOf(Range.prototype), "constructor", this).call(this);
    var elId = options.id;
    this._el = document.getElementById(elId) || options.el;
    this._el.style.position = "relative"; // TODO �������� ���������
    if (this._el === null) return;
    this._el.className = this._el.className ? +" " : "" + "range-component";

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._headerWidth = 20;

    this._create();
  }

  _createClass(Range, [{
    key: "_create",
    value: function _create() {
      this._zone = document.createElement('div');
      this._zone.className = "zone";
      this._el.appendChild(this._zone);

      this._header = document.createElement('div');
      this._header.className = "header";
      this._el.appendChild(this._header);

      this._pointHeader = document.createElement('div');
      this._pointHeader.className = "point-header";
      this._header.appendChild(this._pointHeader);

      this._header.addEventListener("mousedown", this._onMouseDown);
    }
  }, {
    key: "_onMouseDown",
    value: function _onMouseDown() {
      document.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("mouseup", this._onMouseUp);
    }
  }, {
    key: "_onMouseMove",
    value: function _onMouseMove(e) {
      var boundRect = this._el.getBoundingClientRect(),
          pos = e.pageX - boundRect.left;

      if (pos > this._el.offsetWidth - this._headerWidth) pos = this._el.offsetWidth - this._headerWidth;
      if (pos < 0) pos = 0;

      this.update(pos); //TODO ��������� � value
      this.value = 100 / (this._el.offsetWidth - this._headerWidth) * pos;
    }
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(e) {
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
    }
  }, {
    key: "update",
    value: function update(pos) {
      this._header.style.marginLeft = pos + "px";
      this._zone.style.left = pos + 10 + "px";
    }
  }, {
    key: "value",
    get: function get() {
      return Math.round(this._value);
    },
    set: function set(value) {
      this._value = value;
      this.fire("change", {});
    }
  }]);

  return Range;
})(AbstractComponent);

//# sourceMappingURL=Component-compiled.js.map