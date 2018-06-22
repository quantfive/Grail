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


var CheckModal = function (_React$Component) {
  _inherits(CheckModal, _React$Component);

  function CheckModal(props) {
    _classCallCheck(this, CheckModal);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.closeModal = function () {
      var modalActions = _this.props.modalActions;

      modalActions.openCheckModal(false);
    };

    _this.parseDifference = function (differences) {
      var differenceMessages = [];
      var difference = { added: [], modified: [], removed: [] };
      for (var i = 0; i < differences.length; i++) {
        for (var j = 0; j < differences[i].added.length; j++) {
          difference.added.push({ html: differences[i].added[j].html });
        }

        for (var _j = 0; _j < differences[i].modified.length; _j++) {
          var changes = { changes: [] };
          for (var k = 0; k < differences[i].modified[_j].changes.length; k++) {
            var change = differences[i].modified[_j].changes[k];
            changes.changes.push('The ' + change.attribute + ' of element "' + (differences[i].modified[_j].id ? differences[i].modified[_j].id : differences[i].modified[_j].order) + '" has changed from "' + change.old_value + '" to "' + change.new_value + '" ');
          }
          difference.modified.push(changes);
        }

        differenceMessages.push(difference);
        // for (let i = 0; i < differences.removed.length; i++) {
        // }
      }

      _this.setState({
        differences: differenceMessages
      });
    };

    _this.state = {
      login: true,
      differences: []
    };
    return _this;
  }

  /***
  * closes the send funds modal
  */


  CheckModal.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.grail.differences !== nextProps.grail.differences) {
      console.log(nextProps);
      this.parseDifference(nextProps.grail.differences);
    }
  };

  CheckModal.prototype.render = function render() {
    var _props = this.props,
        modals = _props.modals,
        grail = _props.grail;

    var differences = this.state.differences.map(function (difference, index) {
      var added = difference.added.map(function (added, index) {
        return _react2.default.createElement(
          'div',
          null,
          added.html
        );
      });
      var modified = difference.modified.map(function (modified, index) {
        var changes = modified.changes.map(function (change, index) {
          return _react2.default.createElement(
            'div',
            null,
            change
          );
        });

        return _react2.default.createElement(
          'div',
          null,
          changes
        );
      });
      var removed = difference.removed.map(function (removed, index) {
        return _react2.default.createElement(
          'div',
          null,
          removed
        );
      });
      return _react2.default.createElement(
        _reactCollapsible2.default,
        { trigger: _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.collapsibleTrigger) },
            'Action Trigger'
          ) },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.collapsibleContent) },
          _react2.default.createElement(
            'h3',
            null,
            'Added'
          ),
          added.length !== 0 ? added : 'No additions found',
          _react2.default.createElement(
            'h3',
            null,
            'Modified'
          ),
          modified.length !== 0 ? modified : 'No modifications found',
          _react2.default.createElement(
            'h3',
            null,
            'Removed'
          ),
          removed.length !== 0 ? removed : 'No removals found'
        )
      );
    });
    return _react2.default.createElement(
      _reactModal2.default,
      {
        className: (0, _aphrodite.css)(styles.modal),
        isOpen: modals.openCheckModal,
        contentLabel: 'CheckModal',
        onRequestClose: this.closeModal,
        style: overlayStyles },
      _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.differenceContainer) },
        differences
      )
    );
  };

  return CheckModal;
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
    borderRadius: '4px',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    padding: '25px',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    height: '500px',
    overflow: 'scroll'
  },
  modified: {
    margin: '5px 0'
  },
  collapsibleTrigger: {
    background: '#ddd',
    padding: '10px',
    cursor: 'pointer'
  },
  collapsibleContent: {
    paddingLeft: '10px'
  }
});

var mapStateToProps = function mapStateToProps(state) {
  return {
    modals: state.modals,
    grail: state.grail
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    modalActions: (0, _redux.bindActionCreators)(_modals.ModalActions, dispatch)
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CheckModal);
module.exports = exports['default'];