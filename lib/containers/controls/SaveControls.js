'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aphrodite = require('aphrodite');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _api = require('../../config/api');

var _api2 = _interopRequireDefault(_api);

var _helpers = require('../../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _empty_chrome_styles = require('../../config/empty_chrome_styles');

var _empty_chrome_styles2 = _interopRequireDefault(_empty_chrome_styles);

var _grail = require('../../redux/grail');

var _modals = require('../../redux/modals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /***
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The save + check page controls
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// NPM Modules

// import Niffy from 'niffy';

// Config


// Redux


var oldFetch = void 0;
if (window) {
  oldFetch = window.fetch;
}

var SKIPTAGS = {
  script: true,
  head: true,
  meta: true,
  style: true,
  title: true
};

var SaveControls = function (_Component) {
  _inherits(SaveControls, _Component);

  function SaveControls() {
    var _this2 = this;

    _classCallCheck(this, SaveControls);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.clickSave = function (e) {
      e.stopPropagation();
      e.preventDefault();
      window.scrollTo(0, 0);

      var api = _api2.default.SAVE_PAGE_STATE;
      var page_state = _this.getAll();

      return fetch(api, _api2.default.POST_CONFIG({ page_state: page_state })).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        console.log(json);
      });
    };

    _this.takeSnapshot = function () {
      var _this$props = _this.props,
          grailActions = _this$props.grailActions,
          grail = _this$props.grail;

      window.scrollTo(0, 0);

      var page_state = _this.getAll();
      if (grail.recording) {
        grailActions.recordEvent({
          snapshot: page_state
        });
      }

      return page_state;
    };

    _this.getPlayBack = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _this$props2, grail, grailActions, api, states, first;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$props2 = _this.props, grail = _this$props2.grail, grailActions = _this$props2.grailActions;

              fetch = _this.fetch;
              window.scrollTo(0, 0);

              api = _api2.default;

              _this.takeSnapshot();
              _context.next = 7;
              return grailActions.playback();

            case 7:
              states = _context.sent;
              first = states.playback[0];

              _this.playback(first);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    _this.playback = function (pageState) {
      var grailActions = _this.props.grailActions;

      var id = pageState.action_params.id;
      var element = void 0;
      var cur_html = _this.getAllElements();
      if (id) {
        element = document.getElementById(id);
      } else {
        var order = pageState.action_params.order;
        element = document.querySelectorAll('[grail-order="' + order + '"]')[1];
      }
      console.log(pageState);
      switch (pageState.action_name) {
        case 'click':
          element.click();
          _this.snapshotTimeout = setTimeout(function () {
            var page_state = _this.takeSnapshot();
            grailActions.checkHTML({
              cur_html: page_state.html,
              cur_css: page_state.css,
              page_state_id: pageState.id
            });
          }, 500);
          break;
        default:
          console.log('no action');
      }
    };

    _this.clickCheck = function (e) {
      var _this$props3 = _this.props,
          grailActions = _this$props3.grailActions,
          modalActions = _this$props3.modalActions;

      e.stopPropagation();
      e.preventDefault();
      window.scrollTo(0, 0);

      var page_state = _this.getAll();
      var api = _api2.default.DIFF_PAGE_STATE;
      var isGrail = true;

      grailActions.checkPage(api, page_state, isGrail);
      modalActions.openCheckModal(true);
    };

    _this.checkReady = function (e) {
      e.stopPropagation();
      e.preventDefault();
      window.scrollTo(0, 0);

      var res = fetch(_api2.default.CHECK_READY, _api2.default.POST_CONFIG({ test: null })).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        console.log(json);
        console.log(_this.getDocument().readyState);
      });
    };

    _this.recordToggle = function () {
      var _this$props4 = _this.props,
          grail = _this$props4.grail,
          grailActions = _this$props4.grailActions;

      fetch = _this.fetch;
      grailActions.toggleRecord();
      if (_this.state.isRecording && grail.recordedSession.length > 0) {
        grailActions.saveEvent();
      } else if (!_this.state.isRecording) {
        _this.takeSnapshot();
      }
      _this.setState({
        isRecording: !_this.state.isRecording
      });
    };

    _this.fetch = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(api, data) {
        var isGrail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var grailActions, response, clone, res, event;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                grailActions = _this.props.grailActions;

                console.log(isGrail);

                if (!isGrail) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt('return', oldFetch(api, data));

              case 6:
                clearTimeout(_this.snapshotTimeout);
                grailActions.beforeFetch(api);
                _context2.next = 10;
                return oldFetch(api, data);

              case 10:
                response = _context2.sent;
                clone = response.clone();
                _context2.next = 14;
                return _helpers2.default.parseJSON(clone);

              case 14:
                res = _context2.sent;

                grailActions.fetchFinished(api);

                event = {
                  endpoint: api,
                  request_input: data.body ? data.body : null,
                  request_type: data.method,
                  request_output: res ? res : null
                };


                grailActions.recordEvent(event);

                return _context2.abrupt('return', response);

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.recordMouseEvents = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(e) {
        var grailActions, event;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                grailActions = _this.props.grailActions;

                if (!(_this.state.isRecording && !_this.state.firstClick)) {
                  _context4.next = 12;
                  break;
                }

                if (!(e.type === 'click')) {
                  _context4.next = 9;
                  break;
                }

                event = {
                  page_name: window.location.href,
                  action_name: 'click',
                  action_params: {
                    id: e.srcElement.id !== "" ? e.srcElement.id : null,
                    order: e.srcElement.attributes['grail-order'] ? e.srcElement.attributes['grail-order'].value : null,
                    outerHTML: e.srcElement.outerHTML
                  }
                };
                _context4.next = 6;
                return grailActions.recordEvent(event);

              case 6:

                _this.snapshotTimeout = setTimeout(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _this.takeSnapshot();
                          grailActions.addEventToList();

                        case 2:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this2);
                })), 500);

                //console.log(`Click event occured at (x: ${e.clientX} y: ${e.clientY})`)
                _context4.next = 10;
                break;

              case 9:
                if (e.type === 'mousemove') {
                  //console.log(`Current Mouse Position: (x: ${e.clientX} y: ${e.clientY})`)
                }

              case 10:
                _context4.next = 13;
                break;

              case 12:
                if (_this.state.isRecording && _this.state.firstClick) {
                  _this.setState({
                    firstClick: false
                  });
                } else {
                  _this.setState({
                    firstClick: true
                  });
                }

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x4) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.state = {
      isRecording: false,
      firstClick: true
    };
    return _this;
  }

  SaveControls.prototype.getWindow = function getWindow() {
    return window;
  };

  SaveControls.prototype.getPageName = function getPageName() {
    return this.getWindow().location.href;
  };

  SaveControls.prototype.getDocument = function getDocument() {
    return this.getWindow().document;
  };

  SaveControls.prototype.getDocumentHtml = function getDocumentHtml() {
    return this.getDocument().documentElement;
  };

  SaveControls.prototype.getPageState = function getPageState() {
    return {
      page_name: this.getPageName(),
      page_width: this.getWindow().innerWidth,
      html_elements_attributes: this.getAllStyles()
    };
  };

  // Filters: has id, not script


  SaveControls.prototype.getAllElems = function getAllElems(filterById) {
    var all = this.getDocumentHtml().getElementsByTagName("*");
    var elems = [];
    for (var i = 0; i < all.length; i++) {
      if (!SKIPTAGS[all[i].tagName.toLowerCase()]) {
        if (filterById) {
          if (all[i].id !== '') {
            elems.push(all[i]);
          }
        } else {
          elems.push(all[i]);
        }
      }
    }
    return elems;
  };

  SaveControls.prototype.getAllStyles = function getAllStyles() {
    var all = this.getAllElems(true);
    var elems = [];
    for (var i = 0; i < all.length; i++) {
      var style = { element_id: all[i].id, html: all[i].outerHTML.replace(all[i].innerHTML, ''), css_attributes: {} };
      // Computed CSS Properties
      var _styles = this.getWindow().getComputedStyle(all[i]);
      for (var j = 0; j < _styles.length; j++) {
        var value = _styles.getPropertyValue(_styles[j]);
        // Don't include default styles to reduce size of styles
        if (_empty_chrome_styles2.default[_styles[j]] !== value) {
          style['css_attributes'][_styles[j]] = value;
        }
      }
      // Computed Postion of Element
      var boundingRect = all[i].getBoundingClientRect();
      for (var attrname in boundingRect) {
        if (!isNaN(boundingRect[attrname])) {
          style['css_attributes']['bounding_' + attrname] = boundingRect[attrname];
        }
      }
      // Text of Element
      if (all[i].childNodes.length > 0) {
        style['css_attributes']['text'] = all[i].childNodes[0].nodeValue;
      }
      elems.push(style);
    }
    return elems;
  };

  SaveControls.prototype.getAllElements = function getAllElements() {
    var body = this.getDocumentHtml().getElementsByTagName("body");
    var elements = this.getHTMLElements(body, 0);
    return { 'body': elements };
  };

  SaveControls.prototype.getHTMLElements = function getHTMLElements(collection, tempId) {
    if (collection.length == 0) {
      return null;
    }
    // let index = 0;
    var elements = {};
    for (var _iterator = collection, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref5 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref5 = _i.value;
      }

      var child = _ref5;

      if (!child.id) {
        child.setAttribute('grail-order', tempId);
      }
      if (!child.hasChildNodes()) {
        tempId = tempId + 1;
      } else {
        this.getHTMLElements(child.children, tempId + 1);
        tempId = tempId + 1;
      }
    }
    return elements;
  };

  SaveControls.prototype.getAll = function getAll() {
    var all = this.getAllElements();
    var body = this.getDocumentHtml().getElementsByTagName('body');
    var html = body[0].outerHTML;
    var res = {};
    var css = this.getCSS(body, 0, res);
    return { html: html, css: css };
  };

  SaveControls.prototype.getCSS = function getCSS(collection, tempId, result) {
    if (collection.length === 0) {
      return null;
    }

    for (var _iterator2 = collection, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref6 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref6 = _i2.value;
      }

      var child = _ref6;

      var _css = {};
      var id = child.id ? child.id : child.getAttribute('grail-order');
      var rect = this.filter(child.getBoundingClientRect());

      // Computed CSS Properties
      var _styles2 = this.getWindow().getComputedStyle(child);
      for (var j = 0; j < _styles2.length; j++) {
        var value = _styles2.getPropertyValue(_styles2[j]);
        // Don't include default styles to reduce size of styles
        if (_empty_chrome_styles2.default[_styles2[j]] !== value) {
          rect[_styles2[j]] = value;
        }
      }

      if (!child.hasChildNodes()) {
        result[id] = rect;
        tempId = tempId + 1;
      } else {
        result[id] = rect;
        result = _extends({}, result, this.getCSS(child.children, tempId + 1, result));
        tempId = tempId + 1;
      }
    }
    return result;
  };

  SaveControls.prototype.filter = function filter(rect) {
    var dict = {};
    dict['x'] = rect.x;
    dict['y'] = rect.y;
    return dict;
  };

  SaveControls.prototype.compare = function compare(json) {
    var html = json['html'];
    var css = json['css'];
    var new_state = this.getAll();
    console.log(new_state['html'] === html);
    console.log(new_state);
  };

  /***
   * Plays back a specific state of the app
   */


  SaveControls.prototype.componentDidMount = function componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false);
  };

  SaveControls.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _props = this.props,
        grail = _props.grail,
        grailActions = _props.grailActions,
        modalActions = _props.modalActions;

    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      var page_state = this.takeSnapshot();
      if (grail.recording) {
        //grailActions.addEventToList();
      } else {
        grailActions.checkHTML({
          cur_html: page_state.html,
          cur_css: page_state.css,
          page_state_id: grail.playback[0].id
        });
      }
    }

    if (grail.playback.length < prevProps.grail.playback.length && grail.playback.length !== 0) {
      var element = grail.playback[0];
      this.playback(element);
    }

    if (grail.playback.length === 0 && prevProps.grail.playback.length > 0) {
      grailActions.checkPlayback(grail.checkStates);
      modalActions.openCheckModal(true);
    }
  };

  SaveControls.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { id: 'controller', className: (0, _aphrodite.css)(styles.grailTestController) },
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton), onClick: this.clickSave },
        'save'
      ),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.clickCheck },
        'check'
      ),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.checkReady },
        'complete'
      ),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.recordToggle },
        this.state.isRecording ? 'Stop' : 'Record'
      ),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.getPlayBack },
        'playback'
      )
    );
  };

  return SaveControls;
}(_react.Component);

var styles = _aphrodite.StyleSheet.create({
  grailTestController: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    padding: 15,
    background: '#000',
    color: '#fff',
    borderRadius: 5,
    cursor: 'default',
    zIndex: 9999999,
    opacity: 0.1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    ':hover': {
      opacity: 0.7
    }
  },
  grailTestButton: {
    cursor: 'pointer',
    color: '#000',
    background: '#fff',
    fontWeight: 'bold',
    borderRadius: 5,
    fontSize: 14,
    outline: 'none',
    border: '1px solid white'
  },
  grailTestCheck: {
    marginLeft: 10
  },
  grailTestCheck2: {
    marginLeft: 10
  }
});

var mapStateToProps = function mapStateToProps(state) {
  return {
    grail: state.grail
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    grailActions: (0, _redux.bindActionCreators)(_grail.GrailActions, dispatch),
    modalActions: (0, _redux.bindActionCreators)(_modals.ModalActions, dispatch)
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SaveControls);
module.exports = exports['default'];