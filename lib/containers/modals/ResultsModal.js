'use strict';

exports.__esModule = true;

var _StyleSheet$create;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

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

      sessionStorage.clear();
      modalActions.openResultsModal(false);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /***
  * closes the send funds modal
  */


  ResultsModal.prototype.render = function render() {
    var modals = this.props.modals;


    var frontendErrors = sessionStorage.getItem('grail-frontend-errors');
    frontendErrors = JSON.parse(frontendErrors);
    if (!frontendErrors) frontendErrors = [];
    var frontendDisplay = Object.keys(frontendErrors).map(function (page, index) {
      var errorMessages = frontendErrors[page].map(function (error, index) {
        var element = { __html: error.element };
        return _react2.default.createElement(
          _reactCollapsible2.default,
          { trigger: _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.collapsibleTrigger, styles.errorCollapsible) },
              _react2.default.createElement(
                'div',
                null,
                error['message'],
                ' (in ',
                error['filename'],
                ': ',
                error['lineno'],
                ')',
                _react2.default.createElement(
                  'div',
                  { className: (0, _aphrodite.css)(styles.element) },
                  'Element:  ',
                  _react2.default.createElement('div', { style: { marginLeft: 5 }, dangerouslySetInnerHTML: element })
                )
              )
            ) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.errorMessage) },
            _react2.default.createElement(
              'code',
              null,
              error['stack']
            )
          )
        );
      });
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.page) },
        _react2.default.createElement(
          _reactCollapsible2.default,
          {
            trigger: _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.collapsibleTrigger) },
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.pageLabel) },
                page
              ),
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.errorNumber) },
                errorMessages.length,
                ' Errors'
              )
            ) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.collapsibleContent) },
            errorMessages
          )
        )
      );
    });

    var backendErrors = sessionStorage.getItem('grail_backend_errors');
    backendErrors = JSON.parse(backendErrors);
    if (!backendErrors) backendErrors = [];
    var backendDisplay = Object.keys(backendErrors).map(function (page, index) {
      var errorMessages = backendErrors[page].map(function (error, index) {
        var api = error['api'];
        var errorMessage = error['error'];
        var data = error['data'];
        var element = error['element'];

        var dataMethod = '';
        var dataBody = '';
        var dataHeaders = null;
        var headers = null;

        element = { __html: element };

        if (data) {
          dataMethod = data['method'];
          dataBody = data['body'];
          dataHeaders = data['headers'];

          headers = Object.keys(dataHeaders).map(function (header, index) {
            return _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.header) },
              header,
              ' : ',
              dataHeaders[header]
            );
          });
        }

        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.errorLabel) },
          _react2.default.createElement(
            _reactCollapsible2.default,
            {
              trigger: _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.collapsibleTrigger) },
                _react2.default.createElement(
                  'div',
                  { className: (0, _aphrodite.css)(styles.dataMethod) },
                  dataMethod.toUpperCase(),
                  ' ',
                  api
                ),
                _react2.default.createElement(
                  'div',
                  { className: (0, _aphrodite.css)(styles.errorLabel) },
                  errorMessage
                )
              ) },
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.collapsibleContent) },
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.dataBody) },
                'Body: ',
                dataBody
              ),
              headers ? _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.headers) },
                _react2.default.createElement(
                  _reactCollapsible2.default,
                  { trigger: _react2.default.createElement(
                      'div',
                      { className: (0, _aphrodite.css)(styles.collapsibleTrigger) },
                      'Headers:'
                    ), open: true },
                  headers
                )
              ) : null
            )
          ),
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.element) },
            'Element:  ',
            _react2.default.createElement('div', { style: { marginLeft: 5 }, dangerouslySetInnerHTML: element })
          )
        );
      });
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.page) },
        _react2.default.createElement(
          _reactCollapsible2.default,
          {
            trigger: _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.collapsibleTrigger) },
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.pageLabel) },
                page
              ),
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.errorNumber) },
                errorMessages.length,
                ' Errors'
              )
            ) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.collapsibleContent) },
            errorMessages
          )
        )
      );
    });

    var errorCount = 0;
    for (var key in frontendErrors) {
      errorCount += frontendErrors[key].length;
    }
    for (var _key2 in backendErrors) {
      errorCount += backendErrors[_key2].length;
    }

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
        { className: (0, _aphrodite.css)(styles.info) },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.close), onClick: this.closeModal },
          '\xD7'
        ),
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.grailHeader) },
          'Grail Found ',
          errorCount,
          ' errors'
        ),
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.differenceContainer) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.frontendDisplay) },
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.frontendHeaders) },
              'Frontend Errors'
            ),
            frontendDisplay
          ),
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.backendDisplay) },
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.frontendHeaders) },
              'Network Errors'
            ),
            backendDisplay
          )
        )
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

var styles = _aphrodite.StyleSheet.create((_StyleSheet$create = {
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 4,
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    width: '100%',
    height: '100%',
    padding: 25
  },
  differenceContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  info: {
    maxWidth: 1024,
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  grailHeader: {
    color: 'rgb(206, 17, 38)',
    letterSpacing: .7,
    fontSize: 24,
    marginBottom: 16
  },
  errorMessage: {
    whiteSpace: 'pre',
    marginLeft: 30,
    padding: 12,
    background: 'rgba(206, 17, 38, 0.05)',
    overflow: 'auto'
  },
  frontendHeaders: {
    borderBottom: '3px solid',
    fontSize: 18,
    letterSpacing: .7
  },
  errorNumber: {
    marginLeft: 16,
    color: 'rgb(206, 17, 38)'
  },
  errorCollapsible: {
    boxShadow: 'rgba(85, 37, 131, 0.39) 0px 3px 10px 0px',
    padding: 12,
    width: '95%',
    borderRadius: 4
  },
  pageLabel: {},
  modified: {
    margin: '5px 0'
  },
  collapsibleTrigger: {
    cursor: 'pointer',
    marginBottom: 8,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row'
  },
  backendDisplay: {
    marginTop: 16
  },
  collapsibleContent: {
    marginLeft: 30
  }
}, _StyleSheet$create['collapsibleContent'] = {
  paddingLeft: 10,
  marginBottom: 16
}, _StyleSheet$create.close = {
  position: 'absolute',
  fontSize: 26,
  padding: 16,
  right: -16,
  cursor: 'pointer'
}, _StyleSheet$create.element = {
  // marginTop: 7,
  display: 'flex',
  marginTop: 3,
  padding: 4
}, _StyleSheet$create));

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