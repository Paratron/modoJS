import React from 'react';

import {
	propTypes as cellPropTypes,
	defaultProps as cellDefaultProps
} from './Cell';
import Cell from './Cell';

const propTypes = cellPropTypes;
const defaultProps = cellDefaultProps;

const Drawer = (props) => {
	const classNames = ['mdo-drawer'];


	if (props.className) {
		classNames.push(props.className);
	}

	return <Cell {...props} className={classNames.join(' ')}/>;
};

Drawer.propTypes = propTypes;
Drawer.defaultProps = defaultProps;

export default Drawer;
