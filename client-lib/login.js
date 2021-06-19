"use strict";

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es6.regexp.search.js");

require("core-js/modules/es6.regexp.replace.js");

var _jquery = _interopRequireDefault(require("jquery"));

var _hashing = _interopRequireDefault(require("./helper/hashing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var params = new URLSearchParams(globalThis.window.location.search);

function shakeWindow() {
  (0, _jquery.default)('#loginBox').removeClass('shake');
  setTimeout(function () {
    return (0, _jquery.default)('#loginBox').addClass('shake');
  }, 50);
}

function validate(usr, pas) {
  (0, _jquery.default)('#loginButton').addClass('is-loading');

  _jquery.default.ajax({
    url: '/api/user/authenticate',
    dataType: 'json',
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
      username: usr,
      hash: pas
    }),
    success: function success(res) {
      if (!(res !== null && res !== void 0 && res.auth)) {
        shakeWindow();
        setTimeout(function () {
          (0, _jquery.default)('#usernameTextbox').val('').addClass('is-danger');
          (0, _jquery.default)('#passwordTextbox').val('').addClass('is-danger');
          (0, _jquery.default)('#errorText').removeClass('is-hidden');
          (0, _jquery.default)('#loginButton').removeClass('is-loading');
        }, 200);
      } else globalThis.window.location.replace(params.get('rdr') || '/');
    }
  });
}

(0, _jquery.default)(function () {
  (0, _jquery.default)('#loginForm').on('submit', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
      var username, rawPass, hashedPass;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault();
              username = (0, _jquery.default)('#usernameTextbox').val();
              rawPass = (0, _jquery.default)('#passwordTextbox').val();
              hashedPass = (0, _hashing.default)(rawPass);
              validate(username, hashedPass);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});