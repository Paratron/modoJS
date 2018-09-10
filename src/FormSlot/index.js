import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.any,
	children: PropTypes.node,
	className: PropTypes.string,
	onChange: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	className: '',
	enabled: true,
};

export default class FormSlot extends React.Component {
	render() {
		const classNames = ['mdo-formslot'];

		const {
			children,
			className,
			enabled,
			label,
			...restProps
		} = this.props;

		if(!enabled){
			classNames.push('mdo-disabled');
		}

		if(className){
			classNames.push(className);
		}

		return (
			<div className={classNames.join(' ')}>
				<label>
					<span>{ label }</span>
					{React.cloneElement(children, restProps)}
				</label>
			</div>
		);
	}
}

FormSlot.propTypes = propTypes;
FormSlot.defaultProps = defaultProps;
