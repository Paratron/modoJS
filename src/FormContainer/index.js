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

const getInitialState = (children) => {
	let result = {};

	React.Children.forEach(children, (c) => {
		if (c.props.name) {
			result[c.props.name] = c.props.value || null;
		}
	});

	return result;
};

const prepareChildren = (compInstance, children) => React.Children.map(children, (c) => {
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
				value: compInstance.state[name],
				onChange: compInstance.getChangeHandler(name)
			}
		)
	);
});

export default class FormContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handlers = {};
		this.state = props.value || props.children ? getInitialState(props.children) : {};

		this.getChangeHandler = (dataKey) => {
			if (this.handlers[dataKey]) {
				return this.handlers[dataKey];
			}

			const handler = (value) => this.setState({[dataKey]: value});

			this.handlers[dataKey] = handler;

			return handler;
		};
	}

	render() {
		const classNames = ['mdo-form-container'];

		const {
			className,
			children,
		} = this.props;

		if (className) {
			classNames.push(className);
		}

		return (
			<div className={classNames.join(' ')}>
				{prepareChildren(this, children)}
			</div>
		);
	}
}

FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;
