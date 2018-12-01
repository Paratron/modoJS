import React from 'react';
import PropTypes from 'prop-types';

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

export const cleanProps = (props) => Object.keys(props).reduce((acc, key) => {
	if(propTypes[key] === undefined || key === 'type'){
		acc[key] = props[key];
	}
	return acc;
}, {});

export const handleChange = (props) => (e) => {
	if (props.enabled && props.onChange) {
		props.onChange(e.target.value);
	}
};
export const handleFocus = (props, setIsFocused) => () => {
	setIsFocused(true);
	if (props.onFocus) {
		props.onFocus();
	}
	if (props.onFocusBlur) {
		props.onFocusBlur(true);
	}
};
export const handleBlur = (props, setIsFocused) => () => {
	setIsFocused(false);
	if (props.onBlur) {
		props.onBlur();
	}
	if (props.onFocusBlur) {
		props.onFocusBlur();
	}
};
export const handleKeyDown = (props) => (e) => {
	if (!props.onEnter) {
		return;
	}
	if (e.key === 'Enter') {
		props.onEnter();
	}
};

const TextInput = (props) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const [onceFocused, setOnceFocused] = React.useState(false);

	const {
		autofocus,
		value,
		className,
		enabled,
		multiline,
		placeholder,
	} = props;

	const ref = React.useRef();

	React.useEffect(() => {
		if(autofocus && !onceFocused){
			ref.current.focus();
			setOnceFocused(true);
		}
	});

	const classNames = ['mdo-textinput'];

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
				{...cleanProps(props)}
				ref={ref}
				className={classNames.join(' ')}
				onChange={handleChange(props)}
				onFocus={handleFocus(props, setIsFocused)}
				onBlur={handleBlur(props, setIsFocused)}
				value={(value === null || value === undefined) ? '' : value}
				placeholder={placeholder}
			/>
		);
	}

	return (
		<input
			{...cleanProps(props)}
			ref={ref}
			className={classNames.join(' ')}
			onChange={handleChange(props)}
			onFocus={handleFocus(props, setIsFocused)}
			onBlur={handleBlur(props, setIsFocused)}
			onKeyDown={handleKeyDown(props)}
			placeholder={placeholder}
			value={(value === null || value === undefined) ? '' : value}
		/>
	);
};

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
