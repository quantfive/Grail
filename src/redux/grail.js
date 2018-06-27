/***
 * Action / Reducer file to open and close modals
 * @patr
 */

// eslint-disable-next-line
import API from '../config/api';
// eslint-disable-next-line
import Helpers from '../config/helpers';

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

 const GrailConstants = {
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
  TOGGLE_NEW_STATE: '@@grail/TOGGLE_NEW_STATE', 
}

export const GrailActions = {
  /***
   * check page
   */
  checkPage: (api, page_state) => {
    return dispatch => {
      let config = API.POST_CONFIG({page_state: page_state});
      return fetch(api, config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        return dispatch({
          type: GrailConstants.CHECK_PAGE,
          differences: json.differences
        })
      });
    }
  },

  /***
   * Before the fetch occurs, put it into a list
   * @params string url -- the url of the fetch
   */
  beforeFetch: (url) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.FETCH_STARTING,
        url: url,
      });
    }
  },

  /***
   * Adds the HTML given to a list for checking
   */
  checkHTML: (obj) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.ADD_TO_CHECK_LIST,
        obj,
      });
    }
  },

  /***
   * Once record button is clicked, toggles it to true or false
   */
  toggleRecord: () => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.TOGGLE_RECORD,
      });
    }
  },

  /***
   * Playback is done, now check the states on the backend
   * @params [states] -- a list of states to check
   */
  checkPlayback: (states) => {
    return dispatch => {
      console.log(states)
      let config = API.POST_CONFIG({states: states});
      let isGrail = true;
      return fetch(API.PLAYBACK, config, isGrail)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        return dispatch({
          type: GrailConstants.RESET_CHECKSTATES,
          checkStates: [],
          differences: json.differences
        })
      });
    }
  },

  /***
   * Before the fetch occurs, put it into a list
   * @params string url -- the url of the fetch
   */
  fetchFinished: (url) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.FETCH_FINISHED,
        url: url,
      });
    }
  },

   /***
   * record user session
   */
  recordEvent: (event) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.RECORD_EVENT,
        event: event,
      })
    }
  },

  addEventToList: () => {
    return (dispatch, getState) => {
      return dispatch({
        type: GrailConstants.ADD_EVENT_TO_LIST,
        event: getState().grail.event,
      })
    }
  },

  saveEvent: () => {
    return (dispatch, getState) => {
      let config = API.POST_CONFIG(getState().grail.recordedSession);
      let isGrail = true;
      return fetch(API.SAVE_PAGE_STATE, config, isGrail)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        return dispatch({
          type: GrailConstants.SAVE_EVENT,
          recordedSession: [],
          event: {
            previous_state: null
          }
        })
      });
    }
  },

  checkDifferences: () => {
    return (dispatch, getState) => {
      let config = API.POST_CONFIG({
        ...getState().grail.event,
        index: getState().grail.index
      });
      let isGrail = true;
      return fetch(API.DIFF_PAGE_STATE, config, isGrail)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        console.log(json);
      });
    }
  },

  playback: () => {
    return (dispatch, getState) => {
      let config = API.GET_CONFIG();
      let isGrail = true;
      return fetch(API.SESSION, config, isGrail)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        return dispatch({
          type: GrailConstants.START_PLAYBACK,
          playback: json.states,
          checkStates: [],
          playbackIndex: 0,
        })
      });
    }
  },

  getAvailableStates: () => {
    return (dispatch, getState) => {
      let state = null;
      let currentStates = [...getState().grail.availableStates];
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
    }
  },

  saveState: (state) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.SAVE_STATE,
        availableStates: state,
      });
    }
  },

  addClicked: (state) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.ADD_CLICKED,
        clickedStates: state,
      })
    }
  },

  getClicked: () => {
    return (dispatch, getState) => {
      return dispatch({
        type: GrailConstants.GET_CLICKED,
        clickedStates: getState().grail.clickedStates,
      });
    }
  },

  getHref: () => {
    return (dispatch, getState) => {
      let currentHref = getState().grail.currentHref;
      return dispatch({
        type: GrailConstants.GET_HREF,
        currentHref: currentHref,
      });
    }
  },

  setHref: (href) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.SET_HREF,
        currentHref: href,
      });
    }
  },

  addVisited: (key, value) => {
    return dispatch => {
      let dict = {};
      dict[key] = value;
      return dispatch({
        type: GrailConstants.ADD_VISITED,
        visitedStates: dict,
      });
    }
  },

  getVisited: () => {
    return (dispatch, getState) => {
      return dispatch({
        type: GrailConstants.GET_VISITED,
        visitedStates: getState().grail.visitedStates,
      })
    }
  },

  addNewPage: (state) => {
    return dispatch => {
      return dispatch({
        type: GrailConstants.ADD_NEW_PAGE,
        newPageStates: state,
      });
    }
  },

  getNewPage: () => {
    return (dispatch, getState) => {
      let state = null;
      let currentStates = [...getState().grail.newPageStates];
      try {
        state = currentStates.pop();
      } catch(error) {
        console.log('No more new pages');
        state = null;
      }
      return dispatch({
        type: GrailConstants.GET_NEW_PAGE,
        newPageStates: currentStates,
        newPage: state,
      });
    }
  },

  getNewPages: () => {
    return (dispatch, getState) => {
      return dispatch({
        type: GrailConstants.GET_NEW_PAGES,
        newPageStates: getState().grail.newPageStates,  
      });
    }
  },

  isNewState: () => {
    return (dispatch, getState) => {
      return dispatch({
        type: GrailConstants.IS_NEW_STATE,
        newPageState: getState().grail.newPageState,
      });
    }
  },

  toggleNewState: (bool) => {
    return (dispatch, getState) => {
      let isNew = getState().grail.newPageState;
      return dispatch({
        type: GrailConstants.TOGGLE_NEW_STATE,
        newPageState: bool,
      });
    }
  },
}

let getAvailableStates = function() {
  return [window.document];
}

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
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
  newPageState: false,
}

const GrailReducer = (state = defaultState, action) => {
  let activeFetchCalls = []
  let firstState = null;
  switch(action.type) {
    case GrailConstants.GET_AVAILABLE_STATES:
    case GrailConstants.RESET_CHECKSTATES:
      return {
        ...state,
        ...action,
      }
    case GrailConstants.CHECK_PAGE:
    case GrailConstants.SAVE_EVENT:
    case GrailConstants.FETCH_EVENT:
    case GrailConstants.RESET_EVENT:
    case GrailConstants.START_PLAYBACK:
    case GrailConstants.IS_NEW_STATE:
      return {
        ...state,
        ...action,
      }
    case GrailConstants.TOGGLE_NEW_STATE:
      return {
        ...state,
        ...action,
        newPageState: action.newPageState,
      }
    case GrailConstants.GET_NEW_PAGE:
      return {
        ...state,
        ...action,
        newPageStates: [...action.newPageStates],
      }
    case GrailConstants.GET_NEW_PAGES:
      return {
        ...state,
        ...action,
        newPageStates: [...state.newPageStates],
      }
    case GrailConstants.ADD_NEW_PAGE:
      return {
        ...state,
        ...action,
        newPageStates: [...state.newPageStates, ...action.newPageStates],
      }
    case GrailConstants.GET_VISITED:
    case GrailConstants.ADD_VISITED:
      return {
        ...state,
        ...action,
        visitedStates: {...state.visitedStates, ...action.visitedStates},
      }
    case GrailConstants.GET_HREF:
    case GrailConstants.SET_HREF:
      return {
        ...state,
        ...action,
        currentHref: action.currentHref,
      }
    case GrailConstants.GET_CLICKED:
      return {
        ...state,
        ...action,
      }
    case GrailConstants.ADD_CLICKED:
      return {
        ...state,
        ...action,
        clickedStates: [...state.clickedStates, ...action.clickedStates],
      }
    case GrailConstants.SAVE_STATE:
      return {
        ...state,
        ...action,
        availableStates: [...state.availableStates, action.availableStates],
      }
    case GrailConstants.TOGGLE_RECORD:
      return {
        ...state,
        ...action,
        recording: !state.recording,
      }
    case GrailConstants.FETCH_STARTING:
      activeFetchCalls = [...state.activeFetchCalls, action.url];
      return {
        ...state,
        ...action,
        activeFetchCalls: activeFetchCalls,
      }
    case GrailConstants.FETCH_FINISHED:
      activeFetchCalls = [...state.activeFetchCalls];
      let index = activeFetchCalls.indexOf(action.url);
      activeFetchCalls.splice(index, 1);
      return {
        ...state,
        ...action,
        activeFetchCalls: activeFetchCalls,
      }
    case GrailConstants.RECORD_EVENT:
      return {
        ...state,
        ...action,
        event: {...state.event, ...action.event},
      }
    case GrailConstants.ADD_EVENT_TO_LIST:
      return {
        ...state,
        ...action,
        recordedSession: [...state.recordedSession, action.event],
      }
    case GrailConstants.ADD_TO_CHECK_LIST:
      let playbackSessions = [...state.playback];
      playbackSessions.shift()
      return {
        ...state,
        playback: playbackSessions,
        checkStates: [...state.checkStates, action.obj],
      }
    default:
      return state;
  }
}

export default GrailReducer;
