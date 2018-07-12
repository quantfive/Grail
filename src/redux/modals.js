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

 const ModalConstants = {
  RESULTS_MODAL_TOGGLE: '@@modal/RESULTS_MODAL_TOGGLE',
}

export const ModalActions = {
  /***
   * Opens/closes the modal for results
   * @param: boolean -- true opens modal false closes modal
   */
  openResultsModal: (openState) => {
    return dispatch => {
      dispatch({
        type: ModalConstants.RESULTS_MODAL_TOGGLE,
        openResultsModal: openState,
      })
    }
  },
}

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  openResultsModal: false,
}

const ModalReducer = (state = defaultState, action) => {
  switch(action.type) {
    case ModalConstants.RESULTS_MODAL_TOGGLE:
      return {
        ...state,
        ...action
      }
    default:
      return state;
  }
}

export default ModalReducer;
