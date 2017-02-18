import { h, Component } from 'preact';

import { QueryTracker } from './QueryTracker';
import { mediaProps, mutateStyles, mutateWithPredicate } from './lang';

export interface FlexProps {
    style?: any;
    inline?: boolean;
    class?: string | { [key:string]: boolean };

    value?: string | number;
    'xs-value'?: string | number;
    'sm-value'?: string | number;
    'md-value'?: string | number;
    'lg-value'?: string | number;
    'xl-value'?: string | number;
    'gt-xs-value'?: string | number;
    'gt-sm-value'?: string | number;
    'gt-md-value'?: string | number;
    'gt-lg-value'?: string | number;
}

class Flex extends Component<FlexProps, {}> {
    private queryTracker = new QueryTracker(() => this.setState({}));

    public componentWillUnmout() {
        this.queryTracker.clear();
    }

    public render() {
        const apparentProps = {
            value: this.props.value,
            inline: !!this.props.inline,
            class: this.props.class,
            ...mediaProps(this.props, this.queryTracker),
        };

        const {
            value,
            inline,
            class: className,
        } = apparentProps;

        const style = {
            flex: `1 1 ${value || 'auto'}`
        };

        let host: JSX.Element;
        if (inline) {
            if (this.props.children.length !== 1) {
                throw new Error('There must be exactly 1 child to an inline Flex component');
            }

            host = this.props.children[0];
        } else {
            host = <div class={className} style={this.props.style}>{ this.props.children }</div>
        }

        return mutateStyles(host, style);
    }
}

export default Flex;
