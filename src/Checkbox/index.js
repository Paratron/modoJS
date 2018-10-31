import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.boolean,
	label: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	/** Callback to be called onFocus AND onBlur. A boolean will be passed to the cb to tell if the comp has focus. */
	onFocusBlur: PropTypes.func,
	className: PropTypes.string,
	enabled: PropTypes.bool,
	autofocus: PropTypes.bool,
};

const defaultProps = {
	value: false,
	onChange: undefined,
	onFocus: undefined,
	onBlur: undefined,
	onFocusBlur: undefined,
	className: null,
	enabled: true,
	autofocus: false,
};

export default class Checkbox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			focus: false,
		};

		this.handleFocus = () => {
			this.setState({focus: true});
			if (this.props.onFocus) {
				this.props.onFocus();
			}
			if (this.props.onFocusBlur) {
				this.props.onFocusBlur();
			}
		};

		this.handleBlur = () => {
			this.setState({focus: false});
			if (this.props.onBlur) {
				this.props.onBlur();
			}
			if (this.props.onFocusBlur) {
				this.props.onFocusBlur();
			}
		};
	}

	render() {
		const classNames = ['mdo-checkbox'];

		const {
			className,
			value,
			enabled,
			label,
			onChange
		} = this.props;

		const focus = this.state.focus;

		if (!enabled) {
			classNames.push('mdo-disabled');
		}

		if (value) {
			classNames.push('mdo-checked');
		}

		if (focus) {
			classNames.push('mdo-focused');
		}

		if (className) {
			classNames.push(className);
		}

		return (
			<div
				className={classNames.join(' ')}
			>
				<input
					type="checkbox"
					tabIndex={1}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					onChange={onChange}
					checked={value ? true : undefined}
				/>
				<div className="mdo-label">{label}</div>
			</div>
		);
	}
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;
