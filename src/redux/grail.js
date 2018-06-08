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
}

export const GrailActions = {
  /***
   * Opens/closes the modal for authentication
   * @param: boolean -- true opens modal false closes modal
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
}

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  differences: {
    added: [],
    modified: [],
    removed: [],
  }
}

const GrailReducer = (state = defaultState, action) => {
  switch(action.type) {
    case GrailConstants.CHECK_PAGE:
      return {
        ...state,
        ...action
      }
    default:
      return state;
  }
}

export default GrailReducer;
