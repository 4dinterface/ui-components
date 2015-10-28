"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Switch = (function (_AbstractComponent) {
  _inherits(Switch, _AbstractComponent);

  function Switch(options) {
    _classCallCheck(this, Switch);

    _get(Object.getPrototypeOf(Switch.prototype), "constructor", this).call(this);
    var elId = options.id;
    this._el = document.getElementById(elId) || options.el;
    if (this._el === null) return;
    this._create();

    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._onDown = this._onDown.bind(this);

    this._el.addEventListener("mousedown", this._onDown);

    this._el.addEventListener("touchstart", this._onDown);
    this._el.addEventListener("touchmove", this._onMove);
    this._el.addEventListener("touchend", this._onUp);
  }

  _createClass(Switch, [{
    key: "_onDown",
    value: function _onDown(event) {
      var e = event.changedTouches ? event.changedTouches[0] : event;
      this.startX = e.clientX;
      this.mouseDownX = e.clientX;
      document.addEventListener("mousemove", this._onMove);
      document.addEventListener("mouseup", this._onUp);
    }
  }, {
    key: "_onUp",
    value: function _onUp(event) {
      console.log(event);

      var e = event.changedTouches ? event.changedTouches[0] : event;
      this._switchHeader.style.transform = "translateX(0px)";
      if (this.mouseDownX == e.clientX) this["switch"]();

      document.removeEventListener("mousemove", this._onMove);
      document.removeEventListener("mouseup", this._onUp);
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "_onMove",
    value: function _onMove(event) {
      var e = event.changedTouches ? event.changedTouches[0] : event,
          offsetX = e.clientX - this.startX;

      if (this._input.checked && offsetX > 0) offsetX = 0;
      if (!this._input.checked && offsetX < 0) offsetX = 0;

      this._switchHeader.style.transform = "translateX(" + offsetX + "px)";

      if (offsetX < -30) {
        this.startX = e.clientX;
        this["switch"]();
      }

      if (offsetX > 30) {
        this.startX = e.clientX;
        this["switch"]();
      }

      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "_create",
    value: function _create() {
      this._el.innerHTML = '<input type="checkbox" name="switch" class="switch-checkbox" id="' + this._el.id + '_checkbox" checked> </input>' + '<label class="switch-label" for="' + this._el.id + '_checkbox_">' + '<span class="switch-inner"></span>' + '<span class="switch-switch"></span>' + '</label>';

      this._checkbox = document.getElementById(this._el.id + "_checkbox");
      this._switchHeader = this._el.getElementsByClassName('switch-switch')[0];
      this._input = this._el.getElementsByTagName('input')[0];
    }
  }, {
    key: "switch",
    value: function _switch() {
      this.value = !this._input.checked;
      this._switchHeader.style.transform = "translateX(0px)";
    }
  }, {
    key: "value",
    get: function get() {
      return this._checkbox.checked;
    },
    set: function set(value) {
      if (value) this._input.setAttribute("checked", "true");else this._input.removeAttribute("checked");
      this.fire("change", {});
    }
  }]);

  return Switch;
})(AbstractComponent);

//# sourceMappingURL=Component-compiled.js.map