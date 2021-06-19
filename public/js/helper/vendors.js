"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryVendors = queryVendors;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

var _jquery = _interopRequireDefault(require("jquery"));

var _vendor = require("../../api/models/vendor.model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function queryVendors(_x) {
  return _queryVendors.apply(this, arguments);
}

function _queryVendors() {
  _queryVendors = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _jquery.default.ajax({
              url: '/api/vendor/find',
              method: 'POST',
              data: query,
              error: console.error
            });

          case 2:
            _context.t0 = _context.sent;

            if (_context.t0) {
              _context.next = 5;
              break;
            }

            _context.t0 = [];

          case 5:
            return _context.abrupt("return", _context.t0);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _queryVendors.apply(this, arguments);
}