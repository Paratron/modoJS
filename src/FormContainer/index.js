import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	name: PropTypes.string,
	value: PropTypes.object,
	initValue: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	className: PropTypes.string,
	onChange: PropTypes.func,
	onSubmit: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	name: null,
	value: {},
	children: null,
	className: '',
	enabled: true,
};

export const FormContext = React.createContext();

const FormContainer = (props) => {
	const {
		name,
		value,
		initValue,
		children,
		className,
		enabled,
		onSubmit,
		onChange,
	} = props;

	const context = useContext(FormContext);
	const [valueBuffer, setValueBuffer] = useState(initValue);

	const classNames = ['mdo-form-container'];

	if (!enabled) {
		classNames.push('mdo-disabled');
	}

	if (className) {
		classNames.push(className);
	}

	const handleSubmit = () => props.onSubmit(valueBuffer);

	const subContext = context
		? {
			value: context.value ? context.value[name] : {},
			changeHandler: (key) => (value) => {
			    if(value.target){
			        value = value.target.value;
                }
				const newValue = Object.assign({}, context.value ? context.value[name] : {}, {[key]: value});
				context.changeHandler(name)(newValue);
			}
		}
		: initValue
			? {
				value: valueBuffer,
				changeHandler: (key) => (value) => {
                    if(value.target){
                        value = value.target.value;
                    }
					const newValue = Object.assign({}, valueBuffer, {[key]: value});
					setValueBuffer(newValue);
				}
			}
			: {
				value,
				changeHandler: (key) => (val) => {
                    if(val.target){
                        val = val.target.value;
                    }
					const newValue = Object.assign({}, value, {[key]: val});
					onChange(newValue);
				}
			};

	return (
		<div className={classNames.join(' ')}>
			<FormContext.Provider value={subContext}>
				{onSubmit ? children({doSubmit: handleSubmit}) : children}
			</FormContext.Provider>
		</div>
	);
};

FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default FormContainer;
