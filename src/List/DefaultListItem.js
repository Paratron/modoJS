import React from 'react';

export default (rowValue, rowIndex, listValue, listOnChange) => {
	const content = rowValue instanceof Object
		? rowValue.title || rowValue.label || rowValue.name
		: rowValue;

	const classNames = ['mdo-list-item'];

	if(listValue === rowIndex){
		classNames.push('mdo-active');
	}

	const handleClick = () => {
		if(rowValue instanceof Object){
			listOnChange(rowValue.id || rowValue.key);
			return;
		}
		listOnChange(rowIndex)
	};

	return (
		<div
			className={classNames.join(' ')}
			key={rowIndex}
			onClick={handleClick}
		>{content}</div>
	);
};
