import React from 'react';

export default class DynamicHandlerComponent extends React.Component {
	constructor(props) {
		super(props);

		let handlers = {};

		/**
		 * This updates a property in the components state object.
		 * @param string propName
		 * @returns {function}
		 */
		this.handleStateUpdate = (propName) => {
			const handlerKey = 'stateUpdate:' + propName;
			if(handlers[handlerKey]){
				return handlers[handlerKey];
			}

			const handler = (value) => this.setState({ [propName]: value });

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
			if(handlers[handlerKey]){
				return handlers[handlerKey];
			}

			const handler = () => this.setState({ [propName]: !this.state[propName] });

			Object.defineProperty(handler, 'name', {value: handlerKey});

			handlers[handlerKey] = handler;

			return handler;
		}
	}
}