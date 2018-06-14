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
  recordedSession: [],
  event: {}
}

const GrailReducer = (state = defaultState, action) => {
  switch(action.type) {
    case GrailConstants.CHECK_PAGE:
      return {
        ...state,
        ...action
      }
    case GrailConstants.RECORD_EVENT:
      return {
        ...state,
        ...action,
        event: {...state.event, ...action.event}
      }
    default:
      return state;
  }
}

export default GrailReducer;
