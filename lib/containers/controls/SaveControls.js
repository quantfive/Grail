'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps; /***
                                      * The save + check page controls
                                      */

// NPM Modules


// Components


// Config


// Redux


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aphrodite = require('aphrodite');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reactjsPopup = require('reactjs-popup');

var _reactjsPopup2 = _interopRequireDefault(_reactjsPopup);

var _xhook = require('xhook');

var _xhook2 = _interopRequireDefault(_xhook);

var _CheckModal = require('../modals/CheckModal');

var _CheckModal2 = _interopRequireDefault(_CheckModal);

var _ResultsModal = require('../modals/ResultsModal');

var _ResultsModal2 = _interopRequireDefault(_ResultsModal);

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
// let oldSend = window.XMLHttpRequest.prototype.send;
// window.XMLHttpRequest.oldSend = oldSend;

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
      start: false,
      paused: false,
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: [],
      currentElement: null,
      currentHref: '',
      ignoreElements: '',
      currentElementHtml: '',
      currentBackgroundColor: '',
      currentStyles: null
    };

    var resume = sessionStorage.getItem('grail_resume');
    if (resume === 'true') {
      window.fetch = _this.fetch;
    }

    _this.addToIgnore = _this.addToIgnore.bind(_this);
    _this.editIgnore = _this.editIgnore.bind(_this);
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
  =======
  * Pauses click all
  */


  /***
  * Resumes click all
  */


  /***
   * Replace all commas
   */


  /***
   * Checked if we've clicked on the element or not or if it is ignored
   * @params element -- an HTML element
   */


  /***
  * Check if element is in user's ignore list
  * @params element -- an HTML element
  */


  /***
   * Save that we've clicked on a specific element
   * save the full outer HTML
   * @params element -- an HTML element
   */


  /***
  * Checks if an element has been
  * clicked and clicks if it is new
  * @params element -- an HTML element
  */


  /***
   * Clicks all clickable elements
   */


  /***
   * Actions to make after a click is made
   * @params boolean fetchDone -- indicates whether the fetch has finished or not
   */


  /***
   * Checks if we're on a new page or not
   */


  /***
  * Creates listeners for click and hover
  * to detect user selection of elements.
  * @params event - Event object that holds click information
  */


  /***
  * Creates listeners for click and hover
  * to detect user selection of elements.
  * @params event - Event object that holds click information
  */


  /***
  * Adds clicked element to ignore list in storage
  * @params event - Event object that holds click information
  */


  /***
  * Remove clicked element from ignore list in storage
  * @params event - Event object that holds click information
  */


  /***
  * Removes the click and hover listeners
  * to restore original functionality
  */


  /***
  * Highlights an element by temporarily
  * creating a blue background
  * @params event - Event object that holds click information
  */


  /***
  * Sets the background color of element
  * back to its original color
  * @params event - Event object that holds click information
  * @params specific - If specific, then event is target element
  */


  /***
   * Plays back a specific state of the app
   */


  /***
  * Starts fetch timer when a request is made
  * @params request - Unused request object
  */


  /***
  * Checks for errors and if all fetches are finished
  * @params request - Request object
  * @params response - Response object
  */


  /***
   * Records the frontend error and saves it to sessionStorage
   * @params error e -- the error object
   */


  SaveControls.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener('error', this.recordFrontendError, false);
    var grail = this.props.grail;


    var resume = sessionStorage.getItem('grail_resume');
    if (grail.activeFetchCalls.length === 0 && resume === 'true') {
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
      if (grail.recording) {
        var _page_state = this.takeSnapshot();
        grailActions.addEventToList();
      } else {
        if (grail.playback.length > 0) {
          grailActions.checkHTML({
            cur_html: page_state.html,
            cur_css: page_state.css,
            page_state_id: grail.playback[0].id
          });
        }

        var resume = sessionStorage.getItem('grail_resume');
        if (resume === 'true') {
          var elements = this.getAllClickableElements();
          this.setState({
            elements: elements
          }, this.handleLoad);
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
    var _this2 = this;

    var modal = this.props.modal;

    var parser = new DOMParser();
    var ignoreElements = this.retrieveFromStorage('grail_ignoreElements', localStorage);
    var ignoredElements = parser.parseFromString(ignoreElements, 'text/xml')[0];

    var start = this.state.start;
    var paused = this.state.paused;
    var ignoreElementsModal = _react2.default.createElement(
      _reactjsPopup2.default,
      { trigger: _react2.default.createElement(
          'button',
          { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck) },
          'Ignore Element'
        ),
        modal: true,
        closeOnDocumentClick: true
      },
      function (close) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'form',
            { onSubmit: _this2.addToIgnore },
            _react2.default.createElement(
              'p',
              { className: (0, _aphrodite.css)(styles.exampleText) },
              'Instructions: Submit each element that you want to ignore. Use a comma to separate element attributes and values.'
            ),
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.exampleText) },
              ' Ex. Format: [attribute=value], [attribute=value], ... '
            ),
            _react2.default.createElement('input', { type: 'text', onChange: _this2.editIgnore }),
            _react2.default.createElement('input', { type: 'submit' }),
            _react2.default.createElement(
              'p',
              { className: (0, _aphrodite.css)(styles.exampleText) },
              'Current Ignored Elements:'
            ),
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.exampleText) },
              ignoreElements ? ignoreElements.toString() : null
            )
          ),
          _react2.default.createElement(
            'button',
            { onClick: function onClick() {
                close();
              } },
            'close'
          )
        );
      }
    );

    return _react2.default.createElement(
      'div',
      { id: 'controller', className: (0, _aphrodite.css)(styles.grailTestController) },
      !start ? _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton), onClick: this.startClickAll },
        'Click All'
      ) : _react2.default.createElement(
        'div',
        null,
        paused ? _react2.default.createElement(
          'button',
          { className: (0, _aphrodite.css)(styles.grailTestButton), onClick: this.resume },
          'Resume'
        ) : _react2.default.createElement(
          'button',
          { className: (0, _aphrodite.css)(styles.grailTestButton), onClick: this.pause },
          'Pause'
        )
      ),
      modal.openCheckModal && _react2.default.createElement(_CheckModal2.default, null),
      modal.openResultsModal && _react2.default.createElement(_ResultsModal2.default, null),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.addToIgnore },
        'Ignore Element'
      ),
      _react2.default.createElement(
        'button',
        { className: (0, _aphrodite.css)(styles.grailTestButton, styles.grailTestCheck), onClick: this.removeFromIgnore },
        'Remove Ignored Element'
      )
    );
  };

  return SaveControls;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.clickSave = function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0, 0);

    var api = _api2.default.SAVE_PAGE_STATE;
    var page_state = _this3.getAll();

    return fetch(api, _api2.default.POST_CONFIG({ page_state: page_state })).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
      console.log(json);
    });
  };

  this.stringify = function (value) {
    var stringifiedValue = JSON.stringify(value);
    return stringifiedValue;
  };

  this.addToStorage = function (key, value) {
    var storage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : sessionStorage;

    var items = storage.getItem(key);

    if (!items) {
      var valueJson = _this3.stringify([value]);
      storage.setItem(key, valueJson);
    } else {
      var parsedItems = _this3.retrieveFromStorage(key, storage);
      parsedItems.push(value);
      var _valueJson = _this3.stringify(parsedItems);
      storage.setItem(key, _valueJson);
    }
  };

  this.addToStorageByPage = function (key, value, page) {
    var storage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : sessionStorage;

    var currentValue = storage.getItem(key);

    var items = {};
    if (currentValue) {
      items = JSON.parse(currentValue);
    }

    if (page in items) {
      items[page].push(value);
    } else {
      items[page] = [value];
    }
    storage.setItem(key, JSON.stringify(items));
  };

  this.retrieveFromStorage = function (key) {
    var storage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sessionStorage;

    var items = storage.getItem(key);
    var parsedItems = JSON.parse(items);
    return parsedItems;
  };

  this.popFromStorage = function (key) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var storage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : sessionStorage;

    var items = _this3.retrieveFromStorage(key, storage);
    var poppedValue = null;

    if (items && !index) {
      // Key exists in storage
      poppedValue = items.pop();
      storage.setItem(key, _this3.stringify(items));
    } else if (items && index) {
      // Key exists in storage and index given
      poppedValue = items.pop(index);
      storage.setItem(key, _this3.stringify(items));
    }
    return poppedValue;
  };

  this.addVisited = function (href) {
    _this3.addToStorage('grail_visited', href);
  };

  this.getNewPage = function () {
    return _this3.popFromStorage('grail_newPages');
  };

  this.getNewPageStates = function () {
    var page = _this3.getNewPage();
    if (!page) {
      return false;
    }
    sessionStorage.setItem('grail_resume', true);
    window.location.href = page;

    // On page change, some code will be executed
    var x = null;
    var y = null;
    return true;
  };

  this.getAllClickableElements = function () {
    var allElements = _this3.getDocument().querySelectorAll(':not([class^=grailTest])');
    var filteredElements = [];

    for (var i = 0; i < allElements.length; i++) {
      var element = allElements[i];
      var elementClicked = _this3.checkClicked(element);
      if ((element.onclick || element.tagName === 'A') && !elementClicked) {
        filteredElements.push(element);
      }
    }
    return filteredElements;
  };

  this.startClickAll = function () {
    var elements = _this3.getAllClickableElements();

    _xhook2.default.enable();
    _xhook2.default.before(_this3.xmlBeforeHook);
    _xhook2.default.after(_this3.xmlAfterHook);
    window.fetch = _this3.fetch;

    _this3.setState({
      elements: elements,
      start: true
    }, _this3.clickAllElements);
  };

  this.pause = function () {
    _this3.setState({ paused: true });
  };

  this.resume = function () {
    _this3.setState({ paused: false });
    _this3.clickAllElements();
  };

  this.replaceCommas = function (outerHTML) {
    outerHTML.replace(new RegExp(','));
  };

  this.checkClicked = function (element) {
    var clickedElements = sessionStorage.getItem('clicked');

    if (_this3.checkIgnored(element)) {
      return true;
    }

    if (clickedElements) {
      var clickedElementsSet = new Set(clickedElements.split(','));
      var outerHTML = element.outerHTML.replace(/,/g, '_COMMA_');
      return clickedElementsSet.has(outerHTML);
    } else {
      return false;
    }
  };

  this.checkIgnored = function (element) {
    // [Attr = value],[attr=value]
    var ignoredElements = _this3.retrieveFromStorage('grail_ignoreElements', localStorage);

    if (!ignoredElements) {
      return false;
    }

    return ignoredElements.includes(element.outerHTML);
    // if (!ignoredElements) {
    //   return false;
    // }
    // for (let i = 0; i < ignoredElements.length; i++) {
    //   let query = ignoredElements[i][0];
    //   let queriedElements = []
    //   try {
    //     queriedElements = this.getDocument().querySelectorAll(query);
    //   } catch (error) {
    //     // console.log(error);
    //     console.log('invalid query');
    //   }

    //   if (Array.from(queriedElements).includes(element)) {
    //     return true;
    //   }
    // }
    // return false;
  };

  this.saveClicked = function (element) {
    var clickedElements = sessionStorage.getItem('clicked');
    var outerHTML = element.outerHTML.replace(/,/g, '_COMMA_');

    if (!clickedElements) {
      // Init clicked elements
      sessionStorage.setItem('clicked', [outerHTML]);
    } else {
      var clickedElementsSet = new Set(clickedElements.split(','));
      clickedElementsSet.add(outerHTML);
      sessionStorage.setItem('clicked', Array.from(clickedElementsSet));
    }
  };

  this.clickElement = function (element) {
    if (!_this3.checkClicked(element)) {
      _this3.setState({ currentElementHtml: element.outerHTML });
      _this3.saveClicked(element);
      element.click();
    }
  };

  this.clickAllElements = function () {
    var elements = _this3.getAllClickableElements();
    // let elements = this.state.elements;
    var element = elements.pop();
    window.fetch = _this3.fetch;

    if (element !== null && element !== undefined && !_this3.state.paused) {
      var currentHref = window.location.href;
      _this3.setState({
        currentHref: currentHref,
        currentElement: element
      }, function () {
        try {
          _this3.clickElement(element);
        } catch (e) {
          console.log(e);
        }
        _this3.afterClick(false);
      });
    } else if (!_this3.state.paused) {
      _this3.startNewPage();
    } else {
      console.log(_this3.state);
      console.log('paused');
    }
  };

  this.afterClick = function (fetchDone) {
    if (!_this3.state.fetchMade || fetchDone) {
      var grailActions = _this3.props.grailActions;

      var newHref = window.location.href;
      _this3.addVisited(newHref);
      _this3.checkNewPage(newHref);
      // Need this timeout so window.history.back can load;
      var timeout = setTimeout(_this3.clickAllElements.bind(_this3), 200);
    }
  };

  this.checkNewPage = function (newHref) {
    var currentElement = _this3.state.currentElement;
    var currentHref = _this3.state.currentHref;

    if (currentHref !== newHref) {
      var visited = _this3.retrieveFromStorage('grail_visited');
      if (visited) {
        var index = visited.indexOf(currentElement.href);
        if (index !== -1) {
          _this3.popFromStorage('grail_visited', index);
        }
      }

      var hasVisited = !_this3.hasVisited(currentElement);
      if (hasVisited) {
        var href = currentElement.href;
        if (href === undefined || href === null) {
          href = window.location.href;
        }
        _this3.addToStorage('grail_newPages', href);
      }
      window.history.back();
    }
  };

  this.resetGrail = function () {
    window.fetch = oldFetch;
    _xhook2.default.disable();
  };

  this.startNewPage = function () {
    var modalActions = _this3.props.modalActions;

    var newPageState = _this3.getNewPageStates();
    if (!newPageState) {
      modalActions.openResultsModal(true);
      _this3.resetGrail();
    }
  };

  this.hasVisited = function (state) {
    var href = state.href;
    var visited = _this3.retrieveFromStorage('grail_visited');
    var pages = _this3.retrieveFromStorage('grail_newPages');

    if (!visited) {
      return false;
    }

    var hasVisited = visited.includes(href);
    if (!pages) {
      return hasVisited;
    } else {
      return hasVisited || pages.includes(href);
    }
  };

  this.handleLoad = function () {
    var resume = sessionStorage.getItem('grail_resume');

    if (resume === 'true') {
      sessionStorage.setItem('grail_resume', false);
      _this3.addToStorage('grail_visited', window.location.href);
      _this3.clickAllElements();
    }
  };

  this.saveError = function (api, data, error) {
    _this3.addToStorageByPage('grail_backend_errors', {
      api: api,
      data: data,
      error: error,
      element: _this3.state.currentElementHtml,
      page: window.location.href
    }, api);
  };

  this.takeSnapshot = function () {
    var _props2 = _this3.props,
        grailActions = _props2.grailActions,
        grail = _props2.grail;

    window.scrollTo(0, 0);

    var page_state = _this3.getAll();
    if (grail.recording) {
      grailActions.recordEvent({
        snapshot: page_state
      });
    }

    return page_state;
  };

  this.editIgnore = function (event) {
    // Old functionality
    _this3.setState({ ignoreElements: event.target.value });
  };

  this.addToIgnore = function (event) {
    // Old Functionality - Maybe we want both?
    // event.preventDefault();
    // event.stopPropagation();
    // console.log(this.state.ignoreElements);
    // this.addToStorage('grail_ignoreElements', [this.state.ignoreElements]);
    // this.setState({ignoreElements: ''});
    // document.onclick = this.selectElement;
    document.addEventListener('click', _this3.addSelectedElement, true);
    document.body.addEventListener('mouseover', _this3.highlightElement, false);
    document.body.addEventListener('mouseout', _this3.revertHighlight, false);
  };

  this.removeFromIgnore = function (event) {
    document.addEventListener('click', _this3.removeSelectedElement, true);
    document.body.addEventListener('mouseover', _this3.highlightElement, false);
    document.body.addEventListener('mouseout', _this3.revertHighlight, false);
  };

  this.addSelectedElement = function (event) {
    event.preventDefault();
    event.stopPropagation();

    _this3.revertHighlight(event.target, true);
    _this3.addToStorage('grail_ignoreElements', event.target.outerHTML, localStorage);
    _this3.removeListeners(_this3.addSelectedElement);
  };

  this.removeSelectedElement = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var ignoredElements = _this3.retrieveFromStorage('grail_ignoreElements', localStorage);

    _this3.revertHighlight(event.target, true);
    var index = ignoredElements.indexOf(event.target.outerHTML);
    _this3.popFromStorage('grail_ignoreElements', index, localStorage);
    _this3.removeListeners(_this3.removeSelectedElement);
  };

  this.removeListeners = function (selectFunc) {
    document.removeEventListener('click', selectFunc, true);
    document.body.removeEventListener('mouseover', _this3.highlightElement, false);
    document.body.removeEventListener('mouseout', _this3.revertHighlight, false);
  };

  this.highlightElement = function (event) {
    var element = event.target;
    _this3.setState({
      currentBackgroundColor: element.style.backgroundColor,
      currentStyles: element.getAttribute('style')
    });
    element.style.backgroundColor = '#A8C5E5';
  };

  this.revertHighlight = function (event) {
    var specific = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var element = null;
    var styles = _this3.state.currentStyles;
    if (specific) {
      element = event;
    } else {
      element = event.fromElement;
    }

    element.style.backgroundColor = _this3.state.currentBackgroundColor;
    if (!styles) {
      element.removeAttribute('style');
    } else {
      element.setAttribute('style', styles);
    }
  };

  this.getPlayBack = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _props3, grail, grailActions, api, states, first;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _props3 = _this3.props, grail = _props3.grail, grailActions = _props3.grailActions;

            window.fetch = _this3.fetch;
            window.scrollTo(0, 0);

            api = _api2.default;

            _this3.takeSnapshot();
            _context.next = 7;
            return grailActions.playback();

          case 7:
            states = _context.sent;
            first = states.playback[0];

            _this3.playback(first);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this3);
  }));

  this.playback = function (pageState) {
    var grailActions = _this3.props.grailActions;

    var id = pageState.action_params.id;
    var element = void 0;
    var cur_html = _this3.getAllElements();
    if (id) {
      element = document.getElementById(id);
    } else {
      var order = pageState.action_params.order;
      element = document.querySelectorAll('[grail-order="' + order + '"]')[0];
    }

    switch (pageState.action_name) {
      case 'click':
        element.click();
        _this3.snapshotTimeout = setTimeout(function () {
          var page_state = _this3.takeSnapshot();
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
    var _props4 = _this3.props,
        grailActions = _props4.grailActions,
        modalActions = _props4.modalActions;

    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0, 0);

    var page_state = _this3.getAll();
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
      console.log(_this3.getDocument().readyState);
    });
  };

  this.recordToggle = function () {
    var _props5 = _this3.props,
        grail = _props5.grail,
        grailActions = _props5.grailActions;

    window.fetch = _this3.fetch;
    grailActions.toggleRecord();
    if (_this3.state.isRecording && grail.recordedSession.length > 0) {
      grailActions.saveEvent();
    } else if (!_this3.state.isRecording) {
      _this3.takeSnapshot();
    }
    _this3.setState({
      isRecording: !_this3.state.isRecording
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
              grailActions = _this3.props.grailActions;

              clearTimeout(_this3.snapshotTimeout);
              _this3.setState({
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
              _context2.next = 23;
              break;

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2['catch'](11);

            case 23:
              event = {
                endpoint: api,
                request_input: data.body ? data.body : null,
                request_type: data.method,
                request_output: res ? res : null
              };
              _context2.next = 26;
              return grailActions.recordEvent(event);

            case 26:
              _this3.setState({
                fetchMade: false
              });

              // The timeout for fetch being done is here so the element can render properly
              setTimeout(function () {
                grailActions.fetchFinished(api);
              }, 200);

              return _context2.abrupt('return', response);

            case 29:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this3, [[11, 21]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.xmlBeforeHook = function (request) {
    if (_this3.state.start) {
      var grailActions = _this3.props.grailActions;

      var api = request.url;
      grailActions.beforeFetch(api);
    }
  };

  this.xmlAfterHook = function (request, response) {
    var grailActions = _this3.props.grailActions;

    if (_this3.state.start) {
      var api = request.url;
      var body = request.body;
      var method = request.method;
      var data = {
        method: request.method,
        body: request.body,
        headers: request.headers
      };

      var event = {
        endpoint: api,
        request_input: body ? body : null,
        request_type: method,
        request_output: response
      };

      if (response.status >= 400 || response.status === 0 || response instanceof Error) {
        var error = response.statusText;

        if (!error) {
          error = Response.toString();
        }
        _this3.saveError(api, data, error);
      }

      setTimeout(function () {
        grailActions.fetchFinished(api);
      }, 200);
    }
  };

  this.recordMouseEvents = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(e) {
      var grailActions, element, clickElement, i, event;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              grailActions = _this3.props.grailActions;

              if (!(_this3.state.isRecording && !_this3.state.firstClick)) {
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
              if (!_this3.state.fetchMade) {
                _this3.snapshotTimeout = setTimeout(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _this3.takeSnapshot();
                          grailActions.addEventToList();

                        case 2:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this3);
                })), 500);
              }

              _this3.setState({
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
              if (_this3.state.isRecording && _this3.state.firstClick) {
                _this3.setState({
                  firstClick: false
                });
              } else {
                _this3.setState({
                  firstClick: true
                });
              }

            case 18:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this3);
    }));

    return function (_x10) {
      return _ref5.apply(this, arguments);
    };
  }();

  this.fetchListener = function (event) {
    event.respondWith(new Response("Response body", { headers: { "Content-Type": "text/plain" } }));
  };

  this.recordFrontendError = function (e) {
    _this3.addToStorageByPage('grail-frontend-errors', {
      stack: e.error.stack,
      message: e.message,
      filename: e.filename,
      lineno: e.lineno
    }, window.location.pathname);
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
    border: '1px solid white',

    ':active': {
      color: 'gray'
    }
  },
  grailTestCheck: {
    marginLeft: 10
  },
  grailTestCheck2: {
    marginLeft: 10
  },
  exampleText: {
    color: 'black'
  },
  grailHover: {
    backgroundColor: 'black'
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