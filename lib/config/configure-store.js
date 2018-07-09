'use strict';

exports.__esModule = true;
exports.history = undefined;
exports.configure = configure;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactRouterRedux = require('react-router-redux');

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _reduxLogger = require('redux-logger');

var _redux2 = require('../redux');

var _redux3 = _interopRequireDefault(_redux2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = exports.history = (0, _createBrowserHistory2.default)();

var middleware = [_reduxThunk2.default, (0, _reactRouterRedux.routerMiddleware)(history)];

if (process.env.NODE_ENV === 'development') {
  // Configure the logger middleware
  var logger = (0, _reduxLogger.createLogger)({
    level: 'info',
    collapsed: true
  });

  // const devToolsExtension = window.devToolsExtension;

  // if (typeof devToolsExtension === 'function') {
  //   enhancers.push(devToolsExtension());
  // }
  middleware.push(logger);
} else {}

var createStoreWithMiddleware = (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, middleware)(_redux.createStore));

function configure(initialState) {

  // Create the redux store and add middleware to it
  var configStore = createStoreWithMiddleware(_redux3.default, initialState);

  // Snippet to allow hot reload to work with reducers
  if (module.hot) {
    module.hot.accept(function _() {
      configStore.replaceReducer(_redux3.default);
    });
  }

  return configStore;
};