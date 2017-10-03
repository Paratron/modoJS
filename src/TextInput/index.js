import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "../utils/object";
import DynamicHandlerComponent from "../utils/DynamicHandlerComponent";

const propTypes = {
	value: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	className: PropTypes.string,
	enabled: PropTypes.bool,
	multiline: PropTypes.bool,
	autofocus: PropTypes.bool,
};

const defaultProps = {
	value: undefined,
	type: 'text',
	placeholder: '',
	onChange: undefined,
	onFocus: undefined,
	onBlur: undefined,
	className: null,
	enabled: true,
	multiline: false,
	autofocus: false,
};

const removeKeys = Object.keys(propTypes);

export default class TextInput extends DynamicHandlerComponent {
	constructor(props) {
		super(props);

		this.state = {
			isFocused: false,
		};

		this.handleChange = (e) => {
			if (this.props.enabled && this.props.onChange) {
				this.props.onChange(e.target.value);
			}
		};

		this.handleFocus = () => {
			this.setState({isFocused: true});
			if (this.props.onFocus) {
				this.props.onFocus();
			}
		};

		this.handleBlur = () => {
			this.setState({isFocused: false});
			if (this.props.onBlur) {
				this.props.onBlur();
			}
		}
	}

	componentDidMount() {
		if (this.props.autofocus) {
			this.ref.focus();
		}
	}

	render() {
		const classNames = ['mdo-textinput'];

		const {
			value,
			className,
			enabled,
			multiline,
		} = this.props;

		const {
			isFocused,
		} = this.state;

		const cleanedProps = cloneWithoutProps(this.props, removeKeys);

		if (!enabled) {
			classNames.push('mdo-disabled');
		}

		if (value) {
			classNames.push('mdo-filled');
		} else {
			classNames.push('mdo-empty');
		}

		if (isFocused) {
			className.push('mdo-focused');
		}

		if (className) {
			classNames.push(className);
		}

		if (multiline) {
			return (
				<textarea
					{...cleanedProps}
					className={classNames.join(' ')}
					onChange={this.handleChange}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					ref={(elm) => this.ref = elm}
					value={value}
				/>
			);
		}

		return (
			<input
				{...cleanedProps}
				className={classNames.join(' ')}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				ref={(elm) => this.ref = elm}
				value={value}
			/>
		);
	}
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;