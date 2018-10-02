import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.object,
	children: PropTypes.node,
	className: PropTypes.string,
	onChange: PropTypes.func,
	enabled: PropTypes.bool,
};

const defaultProps = {
	value: {},
	children: null,
	className: '',
	onChange: () => {
	},
	enabled: true,
};

const prepareChildren = (compInstance, children, inValue) => React.Children.map(children, (c) => {
	if(!c){
		return c;
	}

	const name = c.props.name;

	if (!name) {
		return c;
	}

	return React.cloneElement(
		c,
		Object.assign(
			{},
			c.props,
			{
				key: c.props.key || name,
				value: inValue ? inValue[name] : compInstance.state[name],
				onChange: compInstance.getChangeHandler(name)
			}
		)
	);
});

export default class FormContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handlers = {};

		this.getChangeHandler = (dataKey) => {
			if (this.handlers[dataKey]) {
				return this.handlers[dataKey];
			}

			const handler = (value) => this.props.onChange(Object.assign({}, this.props.value, {[dataKey]: value}));

			this.handlers[dataKey] = handler;

			return handler;
		};
	}

	render() {
		const classNames = ['mdo-form-container'];

		const {
			className,
			children,
			value,
		} = this.props;

		if (className) {
			classNames.push(className);
		}

		return (
			<div className={classNames.join(' ')}>
				{prepareChildren(this, children, value)}
			</div>
		);
	}
}

FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;
