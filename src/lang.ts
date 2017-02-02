import { cloneElement } from 'preact';

import { mediaQueries, QueryTracker } from './QueryTracker';

const queryKeys = Object.keys(mediaQueries);

export function mediaProps(props: { [key: string]: any }, queryTracker: QueryTracker) {
    const apparentProps = {};
    Object.keys(props)
        .filter(prop => prop.includes('-'))
        .map(prop => {
            const lastDash = prop.lastIndexOf('-');
            const queryName = prop.slice(0, lastDash);
            const property = prop.slice(lastDash + 1);
            return [queryName, property];
        })
        .filter(([query]) => queryKeys.includes(query))
        .filter(([query]) => queryTracker.track(query))
        .forEach(([queryName, propName]) => {
            apparentProps[propName] = props[`${queryName}-${propName}`];
        });
    queryTracker.flush();
    return apparentProps;
}

export function mutateStyles(node: JSX.Element, styles: { [key: string]: string | number }): JSX.Element
export function mutateStyles(node: JSX.Element[], styles: { [key: string]: string | number }): JSX.Element[]
export function mutateStyles(node: JSX.Element | JSX.Element[], styles: { [key: string]: string | number }): JSX.Element | JSX.Element[] {
    return mutateWithPredicate(node as any, props => ({ style: { ...props.style, ...styles } }));
}

export function mutateWithPredicate(node: JSX.Element, predicate: (props: any) => any): JSX.Element
export function mutateWithPredicate(node: JSX.Element[], predicate: (props: any) => any): JSX.Element[]
export function mutateWithPredicate(node: JSX.Element | JSX.Element[], predicate: (props: any) => any): JSX.Element | JSX.Element[] {
    if (Array.isArray(node)) {
        return node.map(child => mutateWithPredicate(child, predicate));
    }

    if (!node.nodeName) {
        // Probably a text node.
        return node;
    }

    const props = node.attributes || {};
    return mutateElement(node, predicate(props) || {});
}

export function mutateElement(node: JSX.Element, props: any): JSX.Element
export function mutateElement(node: JSX.Element[], props: any): JSX.Element[]
export function mutateElement(node: JSX.Element | JSX.Element[], props: any): JSX.Element | JSX.Element[] {
    if (Array.isArray(node)) {
        return node.map(child => mutateElement(child, props));
    }

    return cloneElement(node, props);
}
