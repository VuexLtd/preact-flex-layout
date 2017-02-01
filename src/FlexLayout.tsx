import { h, Component } from 'preact';

import { QueryTracker } from './QueryTracker';
import { mediaProps, mutateStylesOnChildren } from './lang';

export interface LayoutProps {
    style?: any;

    align?: string;
    'xs-align'?: string;
    'sm-align'?: string;
    'md-align'?: string;
    'lg-align'?: string;
    'xl-align'?: string;
    'gt-xs-align'?: string;
    'gt-sm-align'?: string;
    'gt-md-align'?: string;
    'gt-lg-align'?: string;

    column?: boolean;
    'xs-column'?: boolean;
    'sm-column'?: boolean;
    'md-column'?: boolean;
    'lg-column'?: boolean;
    'xl-column'?: boolean;
    'gt-xs-column'?: boolean;
    'gt-sm-column'?: boolean;
    'gt-md-column'?: boolean;
    'gt-lg-column'?: boolean;

    wrap?: boolean;
    'xs-wrap'?: boolean;
    'sm-wrap'?: boolean;
    'md-wrap'?: boolean;
    'lg-wrap'?: boolean;
    'xl-wrap'?: boolean;
    'gt-xs-wrap'?: boolean;
    'gt-sm-wrap'?: boolean;
    'gt-md-wrap'?: boolean;
    'gt-lg-wrap'?: boolean;

    nowrap?: boolean;
    'xs-nowrap'?: boolean;
    'sm-nowrap'?: boolean;
    'md-nowrap'?: boolean;
    'lg-nowrap'?: boolean;
    'xl-nowrap'?: boolean;
    'gt-xs-nowrap'?: boolean;
    'gt-sm-nowrap'?: boolean;
    'gt-md-nowrap'?: boolean;
    'gt-lg-nowrap'?: boolean;

    padding?: boolean;
    'xs-padding'?: boolean;
    'sm-padding'?: boolean;
    'md-padding'?: boolean;
    'lg-padding'?: boolean;
    'xl-padding'?: boolean;
    'gt-xs-padding'?: boolean;
    'gt-sm-padding'?: boolean;
    'gt-md-padding'?: boolean;
    'gt-lg-padding'?: boolean;

    margin?: boolean;
    'xs-margin'?: boolean;
    'sm-margin'?: boolean;
    'md-margin'?: boolean;
    'lg-margin'?: boolean;
    'xl-margin'?: boolean;
    'gt-xs-margin'?: boolean;
    'gt-sm-margin'?: boolean;
    'gt-md-margin'?: boolean;
    'gt-lg-margin'?: boolean;
}

function normaliseAlignment(alignment: string) {
    if (['start', 'end'].includes(alignment)) {
        return `flex-${alignment}`;
    }

    return alignment;
}

class FlexLayout extends Component<LayoutProps, {}> {
    private queryTracker = new QueryTracker(() => this.setState({}));

    public componentWillUnmout() {
        this.queryTracker.clear();
    }

    public render() {
        let { children } = this.props;

        const apparentProps = {
            align: this.props.align,
            column: !!this.props.column,
            wrap: !!this.props.wrap,
            nowrap: !!this.props.nowrap,
            padding: !!this.props.padding,
            margin: !!this.props.margin,
            ...mediaProps(this.props, this.queryTracker),
        };

        const {
            column,
            align,
            wrap,
            nowrap,
            padding,
            margin,
        } = apparentProps;

        const style = {
            display: 'flex',
            flexDirection: column ? 'column' : 'row',
            boxSizing: 'border-box',
        };

        if (align) {
            const [justify, alignment] = align.split(' ');
            if (justify) {
                style['justify-content'] = normaliseAlignment(justify);
            }
            if (alignment) {
                style['align-items'] = normaliseAlignment(alignment);
                style['align-content'] = normaliseAlignment(alignment);
            }
        }

        if (wrap) {
            style['flex-wrap'] = 'wrap';
        }

        if (nowrap) {
            style['flex-wrap'] = 'nowrap';
        }

        if (padding) {
            style['padding'] = 8;
            children = mutateStylesOnChildren(children, { padding: 8 });
        }

        if (margin) {
            style['margin'] = 8;
            children = mutateStylesOnChildren(children, { margin: 8 });
        }

        return <div style={{...style, ...this.props.style}}>{ children }</div>
    }
}

export default FlexLayout;
