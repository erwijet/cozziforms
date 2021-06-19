"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function performToggle() {
  (0, _jquery.default)('.navbar-burger').toggleClass('is-active');
  (0, _jquery.default)('.navbar-menu').toggleClass('is-active');
}

(0, _jquery.default)(function () {
  return (0, _jquery.default)('.navbar-burger').on('click', function (e) {
    return performToggle();
  });
});