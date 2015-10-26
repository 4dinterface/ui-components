"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractComponent = (function () {
  function AbstractComponent() {
    _classCallCheck(this, AbstractComponent);
  }

  _createClass(AbstractComponent, [{
    key: "on",
    value: function on(name, fn) {
      this._el.addEventListener(name, fn);
    }
  }, {
    key: "off",
    value: function off(name, fn) {
      this._el.removeEventListener(name, fn);
    }
  }, {
    key: "fire",
    value: function fire(name, options) {
      var e_onchange = document.createEvent("Event");
      e_onchange.initEvent(name, false, true);
      this._el.dispatchEvent(e_onchange);
    }
  }, {
    key: "async",
    value: function async(fn, context) {
      if (context) fn = fn.bind(context);
      setTimeout(fn, 1);
    }
  }]);

  return AbstractComponent;
})();

//# sourceMappingURL=AbstractComponent-compiled.js.map