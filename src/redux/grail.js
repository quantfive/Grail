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
      console.log(event)
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
      let config = API.POST_CONFIG({...getState().grail.event, index: getState().grail.index});
      console.log(config.body.index);
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
      return fetch(API.PLAYBACK, config, isGrail)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(json => {
        return dispatch({
          type: GrailConstants.START_PLAYBACK,
          playback: json
        })
      });
    }
  },

}

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  differences: {
    added: [],
    modified: [],
    removed: [],
  },
  activeFetchCalls: [],
  recordedSession: [],
  event: {
    previous_state: null
  },
  playback: [],
}

const GrailReducer = (state = defaultState, action) => {
  let activeFetchCalls = []
  switch(action.type) {
    case GrailConstants.CHECK_PAGE:
    case GrailConstants.SAVE_EVENT:
    case GrailConstants.FETCH_EVENT:
    case GrailConstants.RESET_EVENT:
    case GrailConstants.START_PLAYBACK:
      return {
        ...state,
        ...action
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
    default:
      return state;
  }
}

export default GrailReducer;
