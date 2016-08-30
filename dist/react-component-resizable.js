'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = global.React || require('react');

var Resizable = React.createClass({

  lastDimensions: {
    width: null,
    height: null
  },

  propTypes: {
    triggersClass: React.PropTypes.string,
    expandClass: React.PropTypes.string,
    contractClass: React.PropTypes.string,
    embedCss: React.PropTypes.bool,
    onResize: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      triggersClass: 'resize-triggers',
      expandClass: 'expand-trigger',
      contractClass: 'contract-trigger',
      embedCss: true
    };
  },

  requestFrame: function requestFrame(fn) {
    return (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
      return window.setTimeout(fn, 20);
    })(fn);
  },

  cancelFrame: function cancelFrame(id) {
    return (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout)(id);
  },

  componentDidMount: function componentDidMount() {
    this.resetTriggers();
    this.initialResetTriggersTimeout = setTimeout(this.resetTriggers, 1000);
  },

  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.initialResetTriggersTimeout);
  },

  componentDidUpdate: function componentDidUpdate() {
    this.resetTriggers();
  },

  resetTriggers: function resetTriggers() {
    var contract = this.refs.contract;
    var expandChild = this.refs.expandChild;
    var expand = this.refs.expand;

    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = expand.offsetWidth + 1 + 'px';
    expandChild.style.height = expand.offsetHeight + 1 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
  },

  onScroll: function onScroll() {
    if (this.r) this.cancelFrame(this.r);
    this.r = this.requestFrame(function () {
      var dimensions = this.getDimensions();

      if (this.haveDimensionsChanged(dimensions)) {
        this.lastDimensions = dimensions;
        this.props.onResize(dimensions);
        this.resetTriggers();
      }
    }.bind(this));
  },

  getDimensions: function getDimensions() {
    var el = this.refs.resizable;
    return {
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  },

  haveDimensionsChanged: function haveDimensionsChanged(dimensions) {
    return dimensions.width != this.lastDimensions.width || dimensions.height != this.lastDimensions.height;
  },

  render: function render() {
    var _props = this.props;
    var triggersClass = _props.triggersClass;
    var expandClass = _props.expandClass;
    var contractClass = _props.contractClass;
    var embedCss = _props.embedCss;
    var onResize = _props.onResize;

    var rest = _objectWithoutProperties(_props, ['triggersClass', 'expandClass', 'contractClass', 'embedCss', 'onResize']);

    var props = Object.assign({}, rest, { onScroll: this.onScroll, ref: 'resizable' });
    return React.createElement('div', props, [this.props.children, React.createElement('div', { className: triggersClass, key: 'trigger' }, [React.createElement('div', { className: expandClass, ref: 'expand', key: 'expand' }, React.createElement('div', { ref: 'expandChild' })), React.createElement('div', { className: contractClass, ref: 'contract', key: 'contract' })]), embedCss ? React.createElement('style', { key: 'embededCss', dangerouslySetInnerHTML: { __html: '.resize-triggers { visibility: hidden; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }' } }) : null]);
  }

});

module.exports = Resizable;
