"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

var _vendors = require("./helper/vendors");

var _items = require("./helper/items");

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function populateVendorSelect() {
  return _populateVendorSelect.apply(this, arguments);
}
/**

 * @param item The document to append. Should be an IItem with a populated vendor path
 */


function _populateVendorSelect() {
  _populateVendorSelect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var vendors, vendorSelect;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _vendors.queryVendors)({});

          case 2:
            vendors = _context2.sent;
            vendorSelect = (0, _jquery.default)('#vendorSelect');
            vendorSelect.empty();
            vendors.forEach(function (vendor) {
              (0, _jquery.default)('<option>').text(vendor.name).attr('vendorId', vendor._id).appendTo(vendorSelect);
            }); // by default, no option should be selected

            vendorSelect.prop('selectedIndex', -1);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _populateVendorSelect.apply(this, arguments);
}

function appendItemToTable(item) {
  var _this = this,
      _item$vendor$name,
      _item$vendor,
      _item$category$name,
      _item$category;

  var itemTableBody = (0, _jquery.default)('#itemTable').find('tbody');
  var newRow = (0, _jquery.default)('<tr>').attr('itemid', item._id).on('click', function (e) {
    var itemId = (0, _jquery.default)(_this).attr('itemid');
    (0, _jquery.default)(_this).addClass('is-selected');
  });
  [(0, _jquery.default)('<td>').text((_item$vendor$name = (_item$vendor = item.vendor) === null || _item$vendor === void 0 ? void 0 : _item$vendor.name) !== null && _item$vendor$name !== void 0 ? _item$vendor$name : 'mdb population err'), (0, _jquery.default)('<td>').html((_item$category$name = (_item$category = item.category) === null || _item$category === void 0 ? void 0 : _item$category.name) !== null && _item$category$name !== void 0 ? _item$category$name : '<span class="tag">No Category</span>'), (0, _jquery.default)('<td>').text(item.name)].forEach(function (elem) {
    return elem.appendTo(newRow);
  });
  newRow.appendTo(itemTableBody);
}

function populateItemList(_x) {
  return _populateItemList.apply(this, arguments);
}

function _populateItemList() {
  _populateItemList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(regex) {
    var itemTableBody, items;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            itemTableBody = (0, _jquery.default)('#itemTable').find('tbody');
            itemTableBody.empty();
            console.log(regex.source, {
              name: {
                $regex: regex.source,
                $options: 'i'
              }
            });
            _context3.next = 5;
            return (0, _items.queryItems)({
              name: {
                $regex: regex.source,
                $options: 'i'
              }
            });

          case 5:
            items = _context3.sent;
            items.forEach(function (item) {
              return appendItemToTable(item);
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _populateItemList.apply(this, arguments);
}

(0, _jquery.default)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return populateVendorSelect();

        case 2:
          _context.next = 4;
          return populateItemList(/.*/);

        case 4:
          (0, _jquery.default)('#searchboxTxt').on('change', function (e) {
            var _$$val$toString, _$$val;

            console.log((0, _jquery.default)('#searchboxTxt'));
            var query = (_$$val$toString = (_$$val = (0, _jquery.default)('#searchboxTxt').val()) === null || _$$val === void 0 ? void 0 : _$$val.toString()) !== null && _$$val$toString !== void 0 ? _$$val$toString : '';
            console.log(query, new RegExp(query));
            populateItemList(new RegExp(query));
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));