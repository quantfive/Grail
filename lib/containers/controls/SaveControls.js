'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps; /***
                                      * The save + check page controls
                                      */

// NPM Modules

// import Niffy from 'niffy';

// Components


// Config


// Redux


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aphrodite = require('aphrodite');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _CheckModal = require('../modals/CheckModal');

var _CheckModal2 = _interopRequireDefault(_CheckModal);

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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var oldFetch = window.fetch;

var SKIPTAGS = {
  script: true,
  head: true,
  meta: true,
  style: true,
  title: true
};

var SaveControls = (_temp = _class = function (_Component) {
  _inherits(SaveControls, _Component);

  function SaveControls(props) {
    _classCallCheck(this, SaveControls);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: [],
      currentElement: null,
      currentHref: ''
    };

    var resume = sessionStorage.getItem('resume');
    if (resume === 'true') {
      window.fetch = _this.fetch;
    }
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
    var elements = this.getHTMLElements(body, { id: 0 });
    return { 'body': elements };
  };

  SaveControls.prototype.getHTMLElements = function getHTMLElements(collection, tempId) {
    if (collection.length == 0) {
      return null;
    }
    var elements = {};
    for (var _iterator = collection, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var child = _ref;

      if (child.id !== 'wrapper') {
        if (!child.id) {
          child.setAttribute('grail-order', tempId.id);
        } else {
          tempId.id = tempId.id - 1;
        }
        if (!child.hasChildNodes()) {
          tempId.id = tempId.id + 1;
        } else {
          tempId.id = tempId.id + 1;
          this.getHTMLElements(child.children, tempId);
        }
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
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var child = _ref2;

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
   * Gets all clickable elements on the page
   */


  /***
   * Starting the process of clicking all
   */


  /***
   * Clicks all clickable elements
   */


  /***
   * Actions to make after a click is made
   */


  /***
   * Checks if we're on a new page or not
   */


  /***
   * Plays back a specific state of the app
   */


  SaveControls.prototype.componentDidMount = function componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false);
    var grail = this.props.grail;


    if (grail.activeFetchCalls.length === 0) {
      var elements = this.getAllClickableElements();
      this.setState({
        elements: elements
      }, this.handleLoad);
    }
  };

  SaveControls.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _props = this.props,
        grail = _props.grail,
        grailActions = _props.grailActions,
        modalActions = _props.modalActions;

    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      var page_state = this.takeSnapshot();
      if (grail.recording) {
        grailActions.addEventToList();
      } else {
        if (grail.playback.length > 0) {
          grailActions.checkHTML({
            cur_html: page_state.html,
            cur_css: page_state.css,
            page_state_id: grail.playback[0].id
          });
        }

        var resume = sessionStorage.getItem('resume');
        if (resume === 'true') {
          var elements = this.getAllClickableElements();
          this.setState({
            elements: elements
          }, this.handleLoad);
          // this.handleLoad();
        } else {
          this.afterClick(true);
        }
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
    var modal = this.props.modal;

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
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.startClickAll },
        'click all'
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
      ),
      modal.openCheckModal && _react2.default.createElement(_CheckModal2.default, null)
    );
  };

  return SaveControls;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.clickSave = function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0, 0);

    var api = _api2.default.SAVE_PAGE_STATE;
    var page_state = _this2.getAll();

    return fetch(api, _api2.default.POST_CONFIG({ page_state: page_state })).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
      console.log(json);
    });
  };

  this.addVisited = function (href) {
    var visited = sessionStorage.getItem('visited');
    if (!visited) {
      sessionStorage.setItem('visited', [href]);
    } else {
      var visitedPages = visited.split(',');
      visitedPages.push(href);
      sessionStorage.setItem('visited', visitedPages);
    }
  };

  this.getNewPage = function () {
    var newPages = sessionStorage.getItem('newPages');
    if (!newPages) {
      return null;
    } else {
      var pages = newPages.split(',');
      var newPage = pages.pop();
      sessionStorage.setItem('newPages', pages);
      if (!newPage) {
        return _this2.getNewPage();
      }
      return newPage;
    }
  };

  this.getNewPageStates = function () {
    var page = _this2.getNewPage();
    if (!page) {
      return null;
    }
    sessionStorage.setItem('resume', true);
    window.location.href = page;

    var x = null;
    var y = null;
  };

  this.getAllClickableElements = function () {
    var allElements = _this2.getDocument().querySelectorAll(':not([class^=grailTest])');
    var filteredElements = [];

    for (var i = 0; i < allElements.length; i++) {
      var element = allElements[i];
      if (element.onclick) {
        filteredElements.push(element);
      }
    }
    return filteredElements;
  };

  this.startClickAll = function () {
    var elements = _this2.getAllClickableElements();
    _this2.setState({
      elements: elements
    });

    _this2.clickAllElements();
  };

  this.clickAllElements = function () {
    var elements = _this2.state.elements;
    var element = elements.pop();
    window.fetch = _this2.fetch;

    if (element !== null && element !== undefined) {
      var currentHref = window.location.href;
      _this2.setState({
        currentHref: currentHref
      }, function () {
        _this2.state.currentElement = element;
        try {
          element.click();
          _this2.afterClick(false);
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      _this2.startNewPage();
    }
  };

  this.afterClick = function (fetchDone) {
    if (!_this2.state.fetchMade || fetchDone) {
      var grailActions = _this2.props.grailActions;

      var newHref = window.location.href;
      _this2.addVisited(newHref);
      _this2.checkNewPage(newHref);
      // Need this timeout so window.history.back can load;
      var timeout = setTimeout(_this2.clickAllElements.bind(_this2), 200);
    }
  };

  this.checkNewPage = function (newHref) {
    var currentElement = _this2.state.currentElement;
    var currentHref = _this2.state.currentHref;
    if (currentHref !== newHref) {
      var visited = sessionStorage.getItem('visited');
      if (visited) {
        var visitedPages = visited.split(',');
        var index = visitedPages.indexOf(currentElement.href);
        if (index !== -1) {
          visitedPages.pop(index);
          sessionStorage.setItem('visited', visitedPages);
        }
      }

      var newPages = sessionStorage.getItem('newPages');
      var hasVisited = !_this2.hasVisited(currentElement);
      if (!newPages && hasVisited) {
        sessionStorage.setItem('newPages', [currentElement.href]);
      } else if (hasVisited) {
        var pages = newPages.split(',');
        pages.push(currentElement.href);
        sessionStorage.setItem('newPages', pages);
      }

      window.history.back();
    }
  };

  this.startNewPage = function () {
    _this2.getNewPageStates();
  };

  this.hasVisited = function (state) {
    var href = state.href;
    var visited = sessionStorage.getItem('visited');
    var pages = sessionStorage.getItem('newPages');

    if (!visited) {
      return false;
    }

    var visitedPages = visited.split(',');
    var hasVisited = visitedPages.includes(href);
    if (!pages) {
      return hasVisited;
    } else {
      var newPages = pages.split(',');
      return hasVisited || newPages.includes(href);
    }
  };

  this.handleLoad = function () {
    var resume = sessionStorage.getItem('resume');
    var visited = sessionStorage.getItem('visited');
    if (resume === 'true') {
      sessionStorage.setItem('resume', false);
      if (visited) {
        var visitedPages = visited.split(',');
        visitedPages.push(window.location.href);
        sessionStorage.setItem('visited', visitedPages);
      }
      _this2.clickAllElements();
    }
  };

  this.takeSnapshot = function () {
    var _props2 = _this2.props,
        grailActions = _props2.grailActions,
        grail = _props2.grail;

    window.scrollTo(0, 0);

    var page_state = _this2.getAll();
    if (grail.recording) {
      grailActions.recordEvent({
        snapshot: page_state
      });
    }

    return page_state;
  };

  this.getPlayBack = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _props3, grail, grailActions, api, states, first;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _props3 = _this2.props, grail = _props3.grail, grailActions = _props3.grailActions;

            window.fetch = _this2.fetch;
            window.scrollTo(0, 0);

            api = _api2.default;

            _this2.takeSnapshot();
            _context.next = 7;
            return grailActions.playback();

          case 7:
            states = _context.sent;
            first = states.playback[0];

            _this2.playback(first);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this2);
  }));

  this.playback = function (pageState) {
    var grailActions = _this2.props.grailActions;

    var id = pageState.action_params.id;
    var element = void 0;
    var cur_html = _this2.getAllElements();
    if (id) {
      element = document.getElementById(id);
    } else {
      var order = pageState.action_params.order;
      element = document.querySelectorAll('[grail-order="' + order + '"]')[0];
    }

    switch (pageState.action_name) {
      case 'click':
        element.click();
        _this2.snapshotTimeout = setTimeout(function () {
          var page_state = _this2.takeSnapshot();
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

  this.clickCheck = function (e) {
    var _props4 = _this2.props,
        grailActions = _props4.grailActions,
        modalActions = _props4.modalActions;

    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0, 0);

    var page_state = _this2.getAll();
    var api = _api2.default.DIFF_PAGE_STATE;
    var isGrail = true;

    grailActions.checkPage(api, page_state, isGrail);
    modalActions.openCheckModal(true);
  };

  this.checkReady = function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0, 0);

    var res = fetch(_api2.default.CHECK_READY, _api2.default.POST_CONFIG({ test: null })).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
      console.log(json);
      console.log(_this2.getDocument().readyState);
    });
  };

  this.recordToggle = function () {
    var _props5 = _this2.props,
        grail = _props5.grail,
        grailActions = _props5.grailActions;

    window.fetch = _this2.fetch;
    grailActions.toggleRecord();
    if (_this2.state.isRecording && grail.recordedSession.length > 0) {
      grailActions.saveEvent();
    } else if (!_this2.state.isRecording) {
      _this2.takeSnapshot();
    }
    _this2.setState({
      isRecording: !_this2.state.isRecording
    });
  };

  this.fetch = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(api, data) {
      var isGrail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var grailActions, response, resClone, res, event;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              grailActions = _this2.props.grailActions;

              clearTimeout(_this2.snapshotTimeout);
              _this2.setState({
                fetchMade: true
              });

              if (!isGrail) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', oldFetch(api, data));

            case 7:
              grailActions.beforeFetch(api);
              response = null;
              resClone = null;
              res = null;
              _context2.prev = 11;
              _context2.next = 14;
              return oldFetch(api, data);

            case 14:
              response = _context2.sent;

              resClone = response.clone();
              _context2.next = 18;
              return _helpers2.default.parseJSON(resClone);

            case 18:
              res = _context2.sent;
              _context2.next = 24;
              break;

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2['catch'](11);

              console.log(_context2.t0);

            case 24:
              event = {
                endpoint: api,
                request_input: data.body ? data.body : null,
                request_type: data.method,
                request_output: res ? res : null
              };
              _context2.next = 27;
              return grailActions.recordEvent(event);

            case 27:
              _this2.setState({
                fetchMade: false
              });

              // The timeout for fetch being done is here so the element can render properly
              setTimeout(function () {
                grailActions.fetchFinished(api);
              }, 200);

              return _context2.abrupt('return', response);

            case 30:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[11, 21]]);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.recordMouseEvents = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(e) {
      var grailActions, element, clickElement, i, event;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              grailActions = _this2.props.grailActions;

              if (!(_this2.state.isRecording && !_this2.state.firstClick)) {
                _context4.next = 17;
                break;
              }

              if (!(e.type === 'click')) {
                _context4.next = 14;
                break;
              }

              element = e.path[0];

              if (element instanceof SVGElement) {
                element = e.path[1];
              }

              clickElement = element;

              for (i = 0; i < e.path.length; i++) {
                if (e.path[i].onclick) {
                  clickElement = e.path[i];
                }
              }

              event = {
                page_name: window.location.href,
                action_name: 'click',
                action_params: {
                  id: element.id !== "" ? element.id : null,
                  order: element.attributes['grail-order'] ? element.attributes['grail-order'].value : null,
                  outerHTML: element.outerHTML,
                  clickHTML: clickElement.outerHTML
                }
              };
              _context4.next = 10;
              return grailActions.recordEvent(event);

            case 10:
              if (!_this2.state.fetchMade) {
                _this2.snapshotTimeout = setTimeout(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _this2.takeSnapshot();
                          grailActions.addEventToList();

                        case 2:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this2);
                })), 500);
              }

              _this2.setState({
                fetchMade: false
              });

              //console.log(`Click event occured at (x: ${e.clientX} y: ${e.clientY})`)
              _context4.next = 15;
              break;

            case 14:
              if (e.type === 'mousemove') {
                //console.log(`Current Mouse Position: (x: ${e.clientX} y: ${e.clientY})`)
              }

            case 15:
              _context4.next = 18;
              break;

            case 17:
              if (_this2.state.isRecording && _this2.state.firstClick) {
                _this2.setState({
                  firstClick: false
                });
              } else {
                _this2.setState({
                  firstClick: true
                });
              }

            case 18:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this2);
    }));

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }();

  this.fetchListener = function (event) {
    event.respondWith(new Response("Response body", { headers: { "Content-Type": "text/plain" } }));
  };
}, _temp);


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
    grail: state.grail,
    modal: state.modals
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