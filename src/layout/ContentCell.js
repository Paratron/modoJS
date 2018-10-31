import React from 'react';

import {
	propTypes as cellPropTypes,
	defaultProps as cellDefaultProps
} from './Cell';
import Cell from './Cell';

const propTypes = cellPropTypes;
const defaultProps = cellDefaultProps;

const ContentCell = (props) => {
	const classNames = ['mdo-content-cell'];


	if (props.className) {
		classNames.push(props.className);
	}

	return <Cell {...props} className={classNames.join(' ')}/>;
};

ContentCell.propTypes = propTypes;
ContentCell.defaultProps = defaultProps;

export default ContentCell;
