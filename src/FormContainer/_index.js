import React from 'react';
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

export default class FormContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = props.initValue ? props.initValue : {};
		this.handlers = {};
		this.upperContext = null;

		this.initUpperContext = (context) => {
			if (!context) {
				return;
			}

			if (this.upperContext) {
				return;
			}

			this.upperContext = context;
			this.upperChangeHandler = context.getChangeHandler(this.props.name);
		};

		this.getChangeHandler = (dataKey) => {
			if (this.handlers[dataKey]) {
				return this.handlers[dataKey];
			}

			const that = this;

			const handler = (value) => {
				if (that.upperContext) {
					that.upperChangeHandler(Object.assign({}, that.upperContext.value[that.props.name], {[dataKey]: value}));
					return;
				}
				if (that.props.onChange) {
					that.props.onChange(Object.assign({}, that.props.value, {[dataKey]: value}));
					return;
				}
				that.setState(Object.assign({}, that.state, {[dataKey]: value}));
			};

			this.handlers[dataKey] = handler;

			return handler;
		};

		// Its because the function will be passed to sub components and should be named.
		function formContainerSubmit() {
			if (props.onSubmit) {
				props.onSubmit(this.state);
			}
		}

		this.handleSubmit = formContainerSubmit.bind(this);
	}

	render() {
		const classNames = ['mdo-form-container'];

		const {
			children,
			value,
			name,
			className,
			onChange,
			onSubmit,
		} = this.props;

		const stateValue = this.state;

		if (className) {
			classNames.push(className);
		}

		return (
			<div className={classNames.join(' ')}>
				<FormContext.Consumer>
					{(context) => {
						this.initUpperContext(context);

						const contextValue = {
							value: context ? context.value[name] : value,
							getChangeHandler: this.getChangeHandler
						};

						if (!context) {
							if (onChange) {
								contextValue.value = value;
							} else {
								contextValue.value = stateValue;
							}
						}

						return (
							<FormContext.Provider value={contextValue}>
								{onSubmit ? children({doSubmit: this.handleSubmit}) : children}
							</FormContext.Provider>
						);
					}}
				</FormContext.Consumer>
			</div>
		);
	}
}

FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;
