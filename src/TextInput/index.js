import React from 'react';
import PropTypes from 'prop-types';

import {cloneWithoutProps} from "../utils/object";

const propTypes = {
	value: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
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
	className: null,
	enabled: true,
	multiline: false,
	autofocus: false,
};

const removeKeys = Object.keys(propTypes);

export default class TextInput extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = (e) => {
			if (this.props.enabled && this.props.onChange) {
				this.props.onChange(e.target.value);
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
		} = this.props;

		const cleanedProps = cloneWithoutProps(this.props, removeKeys);

		if (!enabled) {
			classNames.push('mdo-disabled');
		}

		if (value) {
			classNames.push('mdo-filled');
		} else {
			classNames.push('mdo-empty');
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
				ref={(elm) => this.ref = elm}
				value={value}
			/>
		);
	}
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;