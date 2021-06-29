(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAdminMode = setAdminMode;
exports.curAdminMode = exports.ADMIN_MODE = void 0;
var ADMIN_MODE = {
  Items: 1,
  Vendors: 2,
  Users: 3
};
exports.ADMIN_MODE = ADMIN_MODE;
var curAdminMode = ADMIN_MODE.Items;
exports.curAdminMode = curAdminMode;

function setAdminMode(mode) {
  $('#tabs-ul').find(`li:nth-child(${curAdminMode})`).removeClass('has-text-primary is-active');
  $('#tabs-ul').find(`li:nth-child(${mode})`).addClass('has-text-primary is-active');
  exports.curAdminMode = curAdminMode = mode;
}

},{}]},{},[1]);
