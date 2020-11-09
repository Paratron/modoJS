import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "../utils/object";
import DynamicHandlerComponent from "../utils/DynamicHandlerComponent";

const propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	type: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	/** Callback to be called onFocus AND onBlur. A boolean will be passed to the cb to tell if the comp has focus. */
	onFocusBlur: PropTypes.func,
	onEnter: PropTypes.func,
	className: PropTypes.string,
	enabled: PropTypes.bool,
	multiline: PropTypes.bool,
	/** Automatically focus the component when mounted. */
	autofocus: PropTypes.bool,
};

const defaultProps = {
	value: undefined,
	type: 'text',
	placeholder: '',
	onChange: undefined,
	onFocus: undefined,
	onBlur: undefined,
	onFocusBlur: undefined,
	onEnter: undefined,
	className: null,
	enabled: true,
	multiline: false,
	autofocus: false,
};

const removeKeys = Object.keys(propTypes).filter(i => i !== 'type');

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
			if (this.props.onFocusBlur) {
				this.props.onFocusBlur(true);
			}
		};

		this.handleBlur = () => {
			this.setState({isFocused: false});
			if (this.props.onBlur) {
				this.props.onBlur();
			}
			if (this.props.onFocusBlur) {
				this.props.onFocusBlur(false);
			}
		};

		this.handleKeyDown = (e) => {
			if(!this.props.onEnter){
				return;
			}

			if(e.key === 'Enter'){
				this.props.onEnter();
			}
		};
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
			placeholder,
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
			classNames.push('mdo-focused');
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
					value={(value === null || value === undefined) ? '' : value}
					placeholder={placeholder}
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
				onKeyDown={this.handleKeyDown}
				placeholder={placeholder}
				ref={(elm) => this.ref = elm}
				value={(value === null || value === undefined) ? '' : value}
			/>
		);
	}
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;
