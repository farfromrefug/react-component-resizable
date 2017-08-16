import React from 'react';
import PropTypes from 'prop-types';

const cancelFrame = id => {
    const cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    return cancel(id);
};

const requestFrame = fn => {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    if (!requestAnimationFrame) {
        requestAnimationFrame = func => window.setTimeout(func, 20);
    }
    return requestAnimationFrame(fn);
};

class Resizable extends React.Component {
    constructor(props) {
        super(props);
        this.lastDimensions = {
            width: null,
            height: null
        };

        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        this.resetTriggers();
        this.initialResetTriggersTimeout = setTimeout(this.resetTriggers, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.initialResetTriggersTimeout);
    }

    componentDidUpdate() {
        this.resetTriggers();
    }

    resetTriggers() {
        const contract = this.refs.contract;
        const expandChild = this.refs.expandChild;
        const expand = this.refs.expand;

        contract.scrollLeft = contract.scrollWidth;
        contract.scrollTop = contract.scrollHeight;
        expandChild.style.width = expand.offsetWidth + 1 + 'px';
        expandChild.style.height = expand.offsetHeight + 1 + 'px';
        expand.scrollLeft = expand.scrollWidth;
        expand.scrollTop = expand.scrollHeight;
    }

    onScroll() {
        if (this.r) {
            cancelFrame(this.r);
        }
        this.r = requestFrame(() => {
            const dimensions = this.getDimensions();

            if (dimensions && this.haveDimensionsChanged(dimensions)) {
                this.lastDimensions = dimensions;
                this.props.onResize(dimensions);
                this.resetTriggers();
            }
        });
    }

    getDimensions() {
        const el = this.refs.resizable;
        if (el) {
            return {
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
    }

    haveDimensionsChanged(dimensions) {
        return dimensions.width !== this.lastDimensions.width || dimensions.height !== this.lastDimensions.height;
    }

    render() {
        const {triggersClass, expandClass, contractClass, embedCss, onResize, ...rest} = this.props;
        const props = Object.assign({}, rest, {onScroll: this.onScroll, ref: 'resizable'});
        return (
            React.createElement('div', props,
                [
                    this.props.children,
                    React.createElement('div', {className: triggersClass, key: 'trigger'},
                        [
                            React.createElement('div', {
                                className: expandClass,
                                ref: 'expand',
                                key: 'expand'
                            }, React.createElement('div', {ref: 'expandChild'})),
                            React.createElement('div', {className: contractClass, ref: 'contract', key: 'contract'})
                        ]
                    ),
                    embedCss ? React.createElement('style', {
                        key: 'embededCss',
                        dangerouslySetInnerHTML: {__html: '.resize-triggers { visibility: hidden; opacity: 0; z-index: -1; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }'}
                    }) : null
                ]
            )
        );
    }
}

Resizable.defaultProps = {
    triggersClass: 'resize-triggers',
    expandClass: 'expand-trigger',
    contractClass: 'contract-trigger',
    embedCss: true
};

Resizable.propTypes = {
    triggersClass: PropTypes.string,
    expandClass: PropTypes.string,
    contractClass: PropTypes.string,
    embedCss: PropTypes.bool,
    onResize: PropTypes.func.isRequired
};

export default Resizable;
