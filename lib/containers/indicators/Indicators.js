'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aphrodite = require('aphrodite');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NPM Modules


var Indicators = function (_Component) {
  _inherits(Indicators, _Component);

  function Indicators() {
    _classCallCheck(this, Indicators);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Indicators.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: (0, _aphrodite.css)(styles.indicatorContainer) },
      _react2.default.createElement('div', {
        className: 'indicator',
        style: { position: 'absolute', left: '0px', top: '152px', width: '1099px', height: '18px', border: '2px solid green' }
      })
    );
  };

  return Indicators;
}(_react.Component);

var styles = _aphrodite.StyleSheet.create({
  indicatorContainer: {
    width: '100%',
    height: '100%'
  }
});

exports.default = Indicators;
module.exports = exports['default'];