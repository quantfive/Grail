'use strict';

exports.__esModule = true;
exports.ModalActions = undefined;

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

var ModalConstants = {
  CHECK_MODAL_TOGGLE: '@@modal/CHECK_MODAL_TOGGLE',
  RESULTS_MODAL_TOGGLE: '@@modal/RESULTS_MODAL_TOGGLE'
};

var ModalActions = exports.ModalActions = {
  /***
   * Opens/closes the modal for authentication
   * @param: boolean -- true opens modal false closes modal
   */
  openCheckModal: function openCheckModal(openModal) {
    return function (dispatch) {
      dispatch({
        type: ModalConstants.CHECK_MODAL_TOGGLE,
        openCheckModal: openModal
      });
    };
  },
  /***
   * Opens/closes the modal for results
   * @param: boolean -- true opens modal false closes modal
   */
  openResultsModal: function openResultsModal(openState) {
    return function (dispatch) {
      dispatch({
        type: ModalConstants.RESULTS_MODAL_TOGGLE,
        openResultsModal: openState
      });
    };
  }

  /**********************************
   *        REDUCER SECTION         *
   **********************************/

};var defaultState = {
  openCheckModal: false,
  openResultsModal: false
};

var ModalReducer = function ModalReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case ModalConstants.CHECK_MODAL_TOGGLE:
      return _extends({}, state, action);
    case ModalConstants.RESULTS_MODAL_TOGGLE:
      return _extends({}, state, action);
    default:
      return state;
  }
};

exports.default = ModalReducer;