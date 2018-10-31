import React from 'react';
import PropTypes from 'prop-types';

import DynamicHandlerComponent from '../utils/DynamicHandlerComponent';

import Button from '../Button';

const propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	type: PropTypes.number,
	enabled: PropTypes.bool,
	items: PropTypes.array,
};

const defaultProps = {
	value: undefined,
	onChange: undefined,
	type: Button.TYPES.DEFAULT,
	enabled: true,
	items: []
};

const activeClass = 'mdo-active';

export default class Toolbar extends DynamicHandlerComponent {
	constructor(props) {
		super(props);

		this.state = {
			selected: props.value,
		};

		const handlers = {};

		this.handleClick = (key) => {
			if (handlers[key]) {
				return handlers[key];
			}

			const handler = () => {
				this.setState({selected: key});
				if (this.props.onChange) {
					this.props.onChange(key);
				}
			};

			handlers[key] = handler;

			return handler;
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({selected: nextProps.value});
	}

	render() {
		const classNames = ['mdo-toolbar'];

		const {
			items,
			type,
			enabled
		} = this.props;

		const selected = this.state.selected;

		const elements = items.map(props => {
			props.type = type || props.type;

			if (props.key === selected) {
				if (props.className) {
					if (props.className.push) {
						props.className.push(activeClass);
					} else {
						props.className += ' ' + activeClass;
					}
				} else {
					props.className = activeClass;
				}
			}

			props.onChange = this.handleClick(props.key);
			props.enabled = enabled;

			return <Button {...props} />;
		});

		return (
			<div className={classNames.join(' ')}>
				{elements}
			</div>
		);
	}
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;