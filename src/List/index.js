import React from 'react';
import PropTypes from 'prop-types';

import defaultListItemRender from './DefaultListItem';

const propTypes = {
	/** An array or object of items to be rendered as list */
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	/** React component to render the list items */
	itemRender: PropTypes.func,
	onChange: PropTypes.func,
	value: PropTypes.string,
	enabled: PropTypes.bool,
	className: PropTypes.string,
};

const defaultProps = {
	itemRender: defaultListItemRender,
	onClick: null,
	enabled: true,
	className: null,
};

const List = (props) => {
	const {
		items,
		itemRender,
		onChange,
		value,
		enabled,
		className
	} = props;

	const classNames = ['mdo-list'];
	const elements = [];

	if(className){
		classNames.push(className);
	}

	if(!enabled){
		classNames.push('mdo-disabled');
	}

	if (items instanceof Array) {
		for (let i = 0; i < items.length; i++) {
			elements.push(itemRender(items[i], i, value, onChange));
		}
	} else if (items instanceof Map) {
		for (let [key, val] of items) {
			elements.push(itemRender(val, key, value, onChange));
		}
	} else if (items instanceof Object) {
		const keys = Object.keys(items);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			elements.push(itemRender(items[key], key, value, onChange));
		}
	}

	return (
		<div className={classNames.join(' ')}>
			{elements}
		</div>
	);
};

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
