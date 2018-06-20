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
  CHECK_MODAL_TOGGLE: '@@modal/CHECK_MODAL_TOGGLE',
}

export const ModalActions = {
  /***
   * Opens/closes the modal for authentication
   * @param: boolean -- true opens modal false closes modal
   */
  openCheckModal: (openModal) => {
    return dispatch => {
      dispatch({
        type: ModalConstants.CHECK_MODAL_TOGGLE,
        openCheckModal: openModal,
      })
    }
  },
}

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  openCheckModal: false,
}

const ModalReducer = (state = defaultState, action) => {
  switch(action.type) {
    case ModalConstants.CHECK_MODAL_TOGGLE:
      return {
        ...state,
        ...action
      }
    default:
      return state;
  }
}

export default ModalReducer;
