'use strict';

exports.__esModule = true;
exports.GrailActions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /***
                                                                                                                                                                                                                                                                   * Action / Reducer file to open and close modals
                                                                                                                                                                                                                                                                   * @patr
                                                                                                                                                                                                                                                                   */

// eslint-disable-next-line

// eslint-disable-next-line


var _api = require('../config/api');

var _api2 = _interopRequireDefault(_api);

var _helpers = require('../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

var GrailConstants = {
  CHECK_PAGE: '@@grail/CHECK_PAGE',
  RECORD_EVENT: '@@grail/RECORD_EVENT',
  FETCH_STARTING: "@@grail/FETCH_STARTING",
  FETCH_FINISHED: '@@grail/FETCH_FINISHED',
  SAVE_EVENT: '@@grail/SAVE_EVENT',
  RESET_EVENT: '@@grail/RESET_EVENT',
  FETCH_EVENT: '@@grail/FETCH_EVENT',
  START_PLAYBACK: '@@grail/START_PLAYBACK',
  ADD_EVENT_TO_LIST: '@@grail/ADD_EVENT_TO_LIST',
  TOGGLE_RECORD: '@@grail/TOGGLE_RECORD',
  ADD_TO_CHECK_LIST: '@@grail/ADD_TO_CHECK_LIST',
  RESET_CHECKSTATES: '@@grail/RESET_CHECKSTATES',
  GET_AVAILABLE_STATES: '@@grail/GET_AVAILABLE_STATES',
  SAVE_STATE: '@@grail/SAVE_STATE',
  ADD_CLICKED: '@@grail/ADD_CLICKED',
  GET_CLICKED: '@@grail/GET_CLICKED',
  GET_HREF: '@@grail/GET_HREF',
  SET_HREF: '@@grail/SET_HREF',
  GET_VISITED: '@@grail/GET_VISITED',
  ADD_VISITED: '@@grail/ADD_VISITED',
  ADD_NEW_PAGE: '@@grail/ADD_NEW_PAGE',
  GET_NEW_PAGE: '@@grail/GET_NEW_PAGE',
  GET_NEW_PAGES: '@@grail/GET_NEW_PAGES',
  IS_NEW_STATE: '@@grail/IS_NEW_STATE',
  TOGGLE_NEW_STATE: '@@grail/TOGGLE_NEW_STATE'
};

var GrailActions = exports.GrailActions = {
  /***
   * check page
   */
  checkPage: function checkPage(api, page_state) {
    return function (dispatch) {
      var config = _api2.default.POST_CONFIG({ page_state: page_state });
      return fetch(api, config).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        return dispatch({
          type: GrailConstants.CHECK_PAGE,
          differences: json.differences
        });
      });
    };
  },

  /***
   * Before the fetch occurs, put it into a list
   * @params string url -- the url of the fetch
   */
  beforeFetch: function beforeFetch(url) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.FETCH_STARTING,
        url: url
      });
    };
  },

  /***
   * Adds the HTML given to a list for checking
   */
  checkHTML: function checkHTML(obj) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.ADD_TO_CHECK_LIST,
        obj: obj
      });
    };
  },

  /***
   * Once record button is clicked, toggles it to true or false
   */
  toggleRecord: function toggleRecord() {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.TOGGLE_RECORD
      });
    };
  },

  /***
   * Playback is done, now check the states on the backend
   * @params [states] -- a list of states to check
   */
  checkPlayback: function checkPlayback(states) {
    return function (dispatch) {
      console.log(states);
      var config = _api2.default.POST_CONFIG({ states: states });
      var isGrail = true;
      return fetch(_api2.default.PLAYBACK, config, isGrail).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        return dispatch({
          type: GrailConstants.RESET_CHECKSTATES,
          checkStates: [],
          differences: json.differences
        });
      });
    };
  },

  /***
   * Before the fetch occurs, put it into a list
   * @params string url -- the url of the fetch
   */
  fetchFinished: function fetchFinished(url) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.FETCH_FINISHED,
        url: url
      });
    };
  },

  /***
  * record user session
  */
  recordEvent: function recordEvent(event) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.RECORD_EVENT,
        event: event
      });
    };
  },

  addEventToList: function addEventToList() {
    return function (dispatch, getState) {
      return dispatch({
        type: GrailConstants.ADD_EVENT_TO_LIST,
        event: getState().grail.event
      });
    };
  },

  saveEvent: function saveEvent() {
    return function (dispatch, getState) {
      var config = _api2.default.POST_CONFIG(getState().grail.recordedSession);
      var isGrail = true;
      return fetch(_api2.default.SAVE_PAGE_STATE, config, isGrail).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        return dispatch({
          type: GrailConstants.SAVE_EVENT,
          recordedSession: [],
          event: {
            previous_state: null
          }
        });
      });
    };
  },

  checkDifferences: function checkDifferences() {
    return function (dispatch, getState) {
      var config = _api2.default.POST_CONFIG(_extends({}, getState().grail.event, {
        index: getState().grail.index
      }));
      var isGrail = true;
      return fetch(_api2.default.DIFF_PAGE_STATE, config, isGrail).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        console.log(json);
      });
    };
  },

  playback: function playback() {
    return function (dispatch, getState) {
      var config = _api2.default.GET_CONFIG();
      var isGrail = true;
      return fetch(_api2.default.SESSION, config, isGrail).then(_helpers2.default.checkStatus).then(_helpers2.default.parseJSON).then(function (json) {
        return dispatch({
          type: GrailConstants.START_PLAYBACK,
          playback: json.states,
          checkStates: [],
          playbackIndex: 0
        });
      });
    };
  },

  getAvailableStates: function getAvailableStates() {
    return function (dispatch, getState) {
      var state = null;
      var currentStates = [].concat(getState().grail.availableStates);
      try {
        state = currentStates.pop();
      } catch (error) {
        state = null;
        console.log('No more states');
      }

      return dispatch({
        type: GrailConstants.GET_AVAILABLE_STATES,
        availableStates: currentStates,
        currentState: state
      });
    };
  },

  saveState: function saveState(state) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.SAVE_STATE,
        availableStates: state
      });
    };
  },

  addClicked: function addClicked(state) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.ADD_CLICKED,
        clickedStates: state
      });
    };
  },

  getClicked: function getClicked() {
    return function (dispatch, getState) {
      return dispatch({
        type: GrailConstants.GET_CLICKED,
        clickedStates: getState().grail.clickedStates
      });
    };
  },

  getHref: function getHref() {
    return function (dispatch, getState) {
      var currentHref = getState().grail.currentHref;
      return dispatch({
        type: GrailConstants.GET_HREF,
        currentHref: currentHref
      });
    };
  },

  setHref: function setHref(href) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.SET_HREF,
        currentHref: href
      });
    };
  },

  addVisited: function addVisited(key, value) {
    return function (dispatch) {
      var dict = {};
      dict[key] = value;
      return dispatch({
        type: GrailConstants.ADD_VISITED,
        visitedStates: dict
      });
    };
  },

  getVisited: function getVisited() {
    return function (dispatch, getState) {
      return dispatch({
        type: GrailConstants.GET_VISITED,
        visitedStates: getState().grail.visitedStates
      });
    };
  },

  addNewPage: function addNewPage(state) {
    return function (dispatch) {
      return dispatch({
        type: GrailConstants.ADD_NEW_PAGE,
        newPageStates: state
      });
    };
  },

  getNewPage: function getNewPage() {
    return function (dispatch, getState) {
      var state = null;
      var currentStates = [].concat(getState().grail.newPageStates);
      try {
        state = currentStates.pop();
      } catch (error) {
        console.log('No more new pages');
        state = null;
      }
      return dispatch({
        type: GrailConstants.GET_NEW_PAGE,
        newPageStates: currentStates,
        newPage: state
      });
    };
  },

  getNewPages: function getNewPages() {
    return function (dispatch, getState) {
      return dispatch({
        type: GrailConstants.GET_NEW_PAGES,
        newPageStates: getState().grail.newPageStates
      });
    };
  },

  isNewState: function isNewState() {
    return function (dispatch, getState) {
      return dispatch({
        type: GrailConstants.IS_NEW_STATE,
        newPageState: getState().grail.newPageState
      });
    };
  },

  toggleNewState: function toggleNewState(bool) {
    return function (dispatch, getState) {
      var isNew = getState().grail.newPageState;
      return dispatch({
        type: GrailConstants.TOGGLE_NEW_STATE,
        newPageState: bool
      });
    };
  }
};

var getAvailableStates = function getAvailableStates() {
  return [window.document];
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

var defaultState = {
  differences: [],
  recording: false,
  activeFetchCalls: [],
  recordedSession: [],
  event: {
    previous_state: null
  },
  playback: [],
  checkStates: [],
  availableStates: getAvailableStates(),
  clickedStates: [],
  currentState: null,
  currentHref: null,
  visitedStates: {},
  newPageStates: [],
  newPageState: false
};

var GrailReducer = function GrailReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  var activeFetchCalls = [];
  var firstState = null;
  switch (action.type) {
    case GrailConstants.GET_AVAILABLE_STATES:
    case GrailConstants.RESET_CHECKSTATES:
      return _extends({}, state, action);
    case GrailConstants.CHECK_PAGE:
    case GrailConstants.SAVE_EVENT:
    case GrailConstants.FETCH_EVENT:
    case GrailConstants.RESET_EVENT:
    case GrailConstants.START_PLAYBACK:
    case GrailConstants.IS_NEW_STATE:
      return _extends({}, state, action);
    case GrailConstants.TOGGLE_NEW_STATE:
      return _extends({}, state, action, {
        newPageState: action.newPageState
      });
    case GrailConstants.GET_NEW_PAGE:
      return _extends({}, state, action, {
        newPageStates: [].concat(action.newPageStates)
      });
    case GrailConstants.GET_NEW_PAGES:
      return _extends({}, state, action, {
        newPageStates: [].concat(state.newPageStates)
      });
    case GrailConstants.ADD_NEW_PAGE:
      return _extends({}, state, action, {
        newPageStates: [].concat(state.newPageStates, action.newPageStates)
      });
    case GrailConstants.GET_VISITED:
    case GrailConstants.ADD_VISITED:
      return _extends({}, state, action, {
        visitedStates: _extends({}, state.visitedStates, action.visitedStates)
      });
    case GrailConstants.GET_HREF:
    case GrailConstants.SET_HREF:
      return _extends({}, state, action, {
        currentHref: action.currentHref
      });
    case GrailConstants.GET_CLICKED:
      return _extends({}, state, action);
    case GrailConstants.ADD_CLICKED:
      return _extends({}, state, action, {
        clickedStates: [].concat(state.clickedStates, action.clickedStates)
      });
    case GrailConstants.SAVE_STATE:
      return _extends({}, state, action, {
        availableStates: [].concat(state.availableStates, [action.availableStates])
      });
    case GrailConstants.TOGGLE_RECORD:
      return _extends({}, state, action, {
        recording: !state.recording
      });
    case GrailConstants.FETCH_STARTING:
      activeFetchCalls = [].concat(state.activeFetchCalls, [action.url]);
      return _extends({}, state, action, {
        activeFetchCalls: activeFetchCalls
      });
    case GrailConstants.FETCH_FINISHED:
      activeFetchCalls = [].concat(state.activeFetchCalls);
      var index = activeFetchCalls.indexOf(action.url);
      activeFetchCalls.splice(index, 1);
      return _extends({}, state, action, {
        activeFetchCalls: activeFetchCalls
      });
    case GrailConstants.RECORD_EVENT:
      return _extends({}, state, action, {
        event: _extends({}, state.event, action.event)
      });
    case GrailConstants.ADD_EVENT_TO_LIST:
      return _extends({}, state, action, {
        recordedSession: [].concat(state.recordedSession, [action.event])
      });
    case GrailConstants.ADD_TO_CHECK_LIST:
      var playbackSessions = [].concat(state.playback);
      playbackSessions.shift();
      return _extends({}, state, {
        playback: playbackSessions,
        checkStates: [].concat(state.checkStates, [action.obj])
      });
    default:
      return state;
  }
};

exports.default = GrailReducer;