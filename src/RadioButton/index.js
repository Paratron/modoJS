import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	label: PropTypes.string,
	tooltip: PropTypes.string,
	enabled: PropTypes.bool,
	className: PropTypes.string,
	checked: PropTypes.bool,
	onClick: PropTypes.func
};

const defaultProps = {
	tooltip: '',
	enabled: true,
	className: '',
	checked: false,
	onClick: () => {
	}
};

export default class RadioButton extends React.Component {
	render() {
		const classNames = ['mdo-radiobutton'];

		const {
			label,
			tooltip,
			enabled,
			className,
			checked,
			onClick
		} = this.props;

		if(!enabled){
			classNames.push('mdo-disabled');
		}

		if(checked){
			classNames.push('mdo-active');
		}

		if(className){
			classNames.push(className);
		}

		return (
			<div onClick={onClick} className={classNames.join(' ')}>
				<span title={tooltip}>{label}</span>
			</div>
		);
	}
}

RadioButton.propTypes = propTypes;
RadioButton.defaultProps = defaultProps;
