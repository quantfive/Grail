'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _aphrodite = require('aphrodite');

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _reactCollapsible = require('react-collapsible');

var _reactCollapsible2 = _interopRequireDefault(_reactCollapsible);

var _modals = require('../../redux/modals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NPM Modules


// Actions


var ResultsModal = function (_React$Component) {
  _inherits(ResultsModal, _React$Component);

  function ResultsModal() {
    var _temp, _this, _ret;

    _classCallCheck(this, ResultsModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.closeModal = function () {
      var modalActions = _this.props.modalActions;

      modalActions.openResultModal(false);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /***
  * closes the send funds modal
  */


  ResultsModal.prototype.render = function render() {
    var modals = this.props.modals;


    var frontendErrors = sessionStorage.getItem('grail-frontend-errors');
    var errors = JSON.parse(frontendErrors);
    var display = Object.keys(errors).map(function (page, index) {
      var errorMessages = errors[page].map(function (error, index) {
        return _react2.default.createElement(
          _reactCollapsible2.default,
          { trigger: _react2.default.createElement('div', { className: (0, _aphrodite.css)(styles.collapsibleTrigger) }) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.errorMessage) },
            error
          )
        );
      });
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.pageLabel) },
        page,
        errorMessages
      );
    });
    return _react2.default.createElement(
      _reactModal2.default,
      {
        className: (0, _aphrodite.css)(styles.modal),
        isOpen: modals.openResultsModal,
        contentLabel: 'ResultsModal',
        onRequestClose: this.closeModal,
        style: overlayStyles },
      _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.differenceContainer) },
        display
      )
    );
  };

  return ResultsModal;
}(_react2.default.Component);

var overlayStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: '2'
  }
};

var styles = _aphrodite.StyleSheet.create({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    width: '80%',
    transform: 'translate(10%, 10%)',
    position: 'absolute',
    padding: 25
  },
  errorMessage: {},
  pageLabel: {},
  modified: {
    margin: '5px 0'
  },
  collapsibleTrigger: {
    background: '#ddd',
    padding: 10,
    cursor: 'pointer',
    marginBottom: 16
  },
  collapsibleContent: {
    paddingLeft: 10,
    marginBottom: 16
  }
});

var mapStateToProps = function mapStateToProps(state) {
  return {
    modals: state.modals
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    modalActions: (0, _redux.bindActionCreators)(_modals.ModalActions, dispatch)
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ResultsModal);
module.exports = exports['default'];