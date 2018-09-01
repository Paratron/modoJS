import React from 'react';

import {
	propTypes as cellPropTypes,
	defaultProps as cellDefaultProps
} from './Cell';
import Cell from './Cell';

const propTypes = cellPropTypes;
const defaultProps = cellDefaultProps;

const AppHeader = (props) => {
	const classNames = ['mdo-appbar'];

	if (props.className) {
		classNames.push(props.className);
	}

	return <Cell {...props} className={classNames.join(' ')}>
		<div>
			{props.children}
		</div>
	</Cell>;
};

AppHeader.propTypes = propTypes;
AppHeader.defaultProps = defaultProps;

export default AppHeader;
