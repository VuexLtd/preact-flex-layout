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

export function mutateChildren(children: JSX.Element[], props: { [key: string]: any }) {
    return children.map(child => cloneElement(child, props));
}

export function mutateStylesOnChildren(children: JSX.Element[], styles: { [key: string]: string | number }) {
    return children.map(child => {
        if (!child.nodeName) {
            return child;
        }

        const attrs = child.attributes || {};
        return cloneElement(child, { style: {...attrs['style'], ...styles} })
    });
}
