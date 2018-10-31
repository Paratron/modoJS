import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	name: PropTypes.string,
	value: PropTypes.object,
	children: PropTypes.node,
	className: PropTypes.string,
	onChange: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	name: null,
	value: {},
	children: null,
	className: '',
	onChange: () => {
	},
	enabled: true,
};

export const FormContext = React.createContext();

export default class FormContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handlers = {};
		this.upperContext = null;

		this.initUpperContext = (context) => {
			if(!context){
				return;
			}

			if(this.upperContext){
				return;
			}

			this.upperContext = context;
			this.upperChangeHandler = context.getChangeHandler(this.props.name);
		};

		this.getChangeHandler = (dataKey) => {
			if (this.handlers[dataKey]) {
				return this.handlers[dataKey];
			}

			const handler = (value) => {
				if(this.upperContext){
					this.upperChangeHandler(Object.assign({}, this.upperContext.value[this.props.name], {[dataKey]: value}));
					return;
				}
				this.props.onChange(Object.assign({}, this.props.value, {[dataKey]: value}))
			};

			this.handlers[dataKey] = handler;

			return handler;
		};
	}

	render() {
		const classNames = ['mdo-form-container'];

		const {
			children,
			value,
			name,
			className
		} = this.props;

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

						return (
							<FormContext.Provider value={contextValue}>
								{children}
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
