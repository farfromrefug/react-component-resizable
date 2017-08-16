'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cancelFrame = function cancelFrame(id) {
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    return cancel(id);
};

var requestFrame = function requestFrame(fn) {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    if (!requestAnimationFrame) {
        requestAnimationFrame = function requestAnimationFrame(func) {
            return window.setTimeout(func, 20);
        };
    }
    return requestAnimationFrame(fn);
};

var Resizable = function (_React$Component) {
    _inherits(Resizable, _React$Component);

    function Resizable(props) {
        _classCallCheck(this, Resizable);

        var _this = _possibleConstructorReturn(this, (Resizable.__proto__ || Object.getPrototypeOf(Resizable)).call(this, props));

        _this.lastDimensions = {
            width: null,
            height: null
        };

        _this.onScroll = _this.onScroll.bind(_this);
        _this.resetTriggers = _this.resetTriggers.bind(_this);
        return _this;
    }

    _createClass(Resizable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.resetTriggers();
            this.initialResetTriggersTimeout = setTimeout(this.resetTriggers, 1000);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearTimeout(this.initialResetTriggersTimeout);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.resetTriggers();
        }
    }, {
        key: 'resetTriggers',
        value: function resetTriggers() {
            var contract = this.refs.contract;
            var expandChild = this.refs.expandChild;
            var expand = this.refs.expand;

            contract.scrollLeft = contract.scrollWidth;
            contract.scrollTop = contract.scrollHeight;
            expandChild.style.width = expand.offsetWidth + 1 + 'px';
            expandChild.style.height = expand.offsetHeight + 1 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
        }
    }, {
        key: 'onScroll',
        value: function onScroll() {
            var _this2 = this;

            if (this.r) {
                cancelFrame(this.r);
            }
            this.r = requestFrame(function () {
                var dimensions = _this2.getDimensions();

                if (dimensions && _this2.haveDimensionsChanged(dimensions)) {
                    _this2.lastDimensions = dimensions;
                    _this2.props.onResize(dimensions);
                    _this2.resetTriggers();
                }
            });
        }
    }, {
        key: 'getDimensions',
        value: function getDimensions() {
            var el = this.refs.resizable;
            if (el) {
                return {
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
            }
        }
    }, {
        key: 'haveDimensionsChanged',
        value: function haveDimensionsChanged(dimensions) {
            return dimensions.width !== this.lastDimensions.width || dimensions.height !== this.lastDimensions.height;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var triggersClass = _props.triggersClass;
            var expandClass = _props.expandClass;
            var contractClass = _props.contractClass;
            var embedCss = _props.embedCss;
            var onResize = _props.onResize;

            var rest = _objectWithoutProperties(_props, ['triggersClass', 'expandClass', 'contractClass', 'embedCss', 'onResize']);

            var props = Object.assign({}, rest, { onScroll: this.onScroll, ref: 'resizable' });
            return _react2.default.createElement('div', props, [this.props.children, _react2.default.createElement('div', { className: triggersClass, key: 'trigger' }, [_react2.default.createElement('div', {
                className: expandClass,
                ref: 'expand',
                key: 'expand'
            }, _react2.default.createElement('div', { ref: 'expandChild' })), _react2.default.createElement('div', { className: contractClass, ref: 'contract', key: 'contract' })]), embedCss ? _react2.default.createElement('style', {
                key: 'embededCss',
                dangerouslySetInnerHTML: { __html: '.resize-triggers { visibility: hidden; opacity: 0; z-index: -1; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }' }
            }) : null]);
        }
    }]);

    return Resizable;
}(_react2.default.Component);

Resizable.defaultProps = {
    triggersClass: 'resize-triggers',
    expandClass: 'expand-trigger',
    contractClass: 'contract-trigger',
    embedCss: true
};

Resizable.propTypes = {
    triggersClass: _propTypes2.default.string,
    expandClass: _propTypes2.default.string,
    contractClass: _propTypes2.default.string,
    embedCss: _propTypes2.default.bool,
    onResize: _propTypes2.default.func.isRequired
};

exports.default = Resizable;
