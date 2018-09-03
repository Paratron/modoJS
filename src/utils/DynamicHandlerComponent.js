import React from 'react';

export default class DynamicHandlerComponent extends React.Component {
	constructor(props) {
		super(props);

		let handlers = {};

		/**
		 * This updates a property in the components state object.
		 * @param string propName
		 * @param string [valueKey=null] If your incoming value is an object and you want to just use one property of it, name it here.
		 * @returns {function}
		 */
		this.handleStateUpdate = (propName, valueKey = null) => {
			const handlerKey = 'stateUpdate:' + propName;
			if (handlers[handlerKey]) {
				return handlers[handlerKey];
			}

			const handler = (value) => this.setState({[propName]: valueKey !== null ? value[valueKey] : value});

			// This helps when using debugger tools!
			Object.defineProperty(handler, 'name', {value: handlerKey});

			handlers[handlerKey] = handler;

			return handler;
		};

		/**
		 * This toggles a boolean state property between true and false.
		 * @param string propName
		 * @returns {function}
		 */
		this.toggleStateValue = (propName) => {
			const handlerKey = 'toggleStateProperty:' + propName;
			if (handlers[handlerKey]) {
				return handlers[handlerKey];
			}

			const handler = () => this.setState({[propName]: !this.state[propName]});

			Object.defineProperty(handler, 'name', {value: handlerKey});

			handlers[handlerKey] = handler;

			return handler;
		};

		/**
		 * Sets a state property to boolean true.
		 * @param propName
		 * @returns {*}
		 */
		this.handleStateUpdateBooleanTrue = (propName) => {
			const handlerKey = 'setStatePropertyToTrue:' + propName;
			if (handlers[handlerKey]) {
				return handlers[handlerKey];
			}

			const handler = () => this.setState({[propName]: true});

			Object.defineProperty(handler, 'name', {value: handlerKey});

			handlers[handlerKey] = handler;

			return handler;
		};

		/**
		 * Sets a state property to boolean false.
		 * @param propName
		 * @returns {*}
		 */
		this.handleStateUpdateBooleanFalse = (propName) => {
			const handlerKey = 'setStatePropertyToFalse:' + propName;
			if (handlers[handlerKey]) {
				return handlers[handlerKey];
			}

			const handler = () => this.setState({[propName]: false});

			Object.defineProperty(handler, 'name', {value: handlerKey});

			handlers[handlerKey] = handler;

			return handler;
		};
	}
}
