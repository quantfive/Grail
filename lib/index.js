'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = require('./containers/app/App');

var _App2 = _interopRequireDefault(_App);

var _reactRedux = require('react-redux');

var _configureStore = require('./config/configure-store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /***
                                                                                                                                                           * Main Library for Grail frontend testing
                                                                                                                                                           * @piccoloman
                                                                                                                                                           */


var store = (0, _configureStore.configure)();

var LOAD_TIME = 1000;

var GrailTest = function () {
  function GrailTest() {
    _classCallCheck(this, GrailTest);

    this.run = function (history) {
      var test = new GrailTest();
      //setTimeout(test.runTests, LOAD_TIME);
      setTimeout(test.injectControls.bind(test, history), LOAD_TIME);
    };
  }

  GrailTest.prototype.getWindow = function getWindow() {
    return window;
  };

  GrailTest.prototype.getPageName = function getPageName() {
    return this.getWindow().location.href;
  };

  GrailTest.prototype.getDocument = function getDocument() {
    return this.getWindow().document;
  };

  GrailTest.prototype.getDocumentHtml = function getDocumentHtml() {
    return this.getDocument().documentElement;
  };

  GrailTest.prototype.doc_ready = function doc_ready(callback) {
    if (typeof document !== 'undefined') {
      // Don't Run on Server Side Rendered React
      if (document.readyState !== 'loading') {
        callback();
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        // IE <= 8
        console.log("ie 8 and below is discouraged");
        document.attachEvent('onreadystatechange', function () {
          if (document.readyState === 'complete') callback();
        });
      }
    }
  };

  GrailTest.prototype.injectControls = function injectControls() {
    var history = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var document = this.getDocument();

    // For webpack hot reloads
    if (document.querySelector('.grail-test-wrapper')) {
      // Already injected controls
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = "grail-test-wrapper";
    wrapper.id = 'wrapper';
    // I think in the future we might want to use createShadowRoot but the api isn't standardized yet
    // var htmlTemplate = `
    // <iframe src="./grail/build/index.html"></iframe>
    // `;
    // wrapper.innerHTML = htmlTemplate;
    document.body.insertBefore(wrapper, document.body.firstChild);
    _reactDom2.default.render(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_App2.default, { id: 'app', history: history })
    ), document.getElementsByClassName('grail-test-wrapper')[0]);

    if (process.env.NODE_ENV !== 'production') {
      window.store = store;
    }
  };

  return GrailTest;
}();

exports.default = GrailTest;
module.exports = exports['default'];