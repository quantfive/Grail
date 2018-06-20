'use strict';

exports.__esModule = true;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _grail = require('./grail');

var _grail2 = _interopRequireDefault(_grail);

var _modals = require('./modals');

var _modals2 = _interopRequireDefault(_modals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  routing: _reactRouterRedux.routerReducer,
  grail: _grail2.default,
  modals: _modals2.default
});
module.exports = exports['default'];