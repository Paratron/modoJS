import React from 'react';

export default class DynamicHandlerComponent extends React.Component {
	constructor(props) {
		super(props);

		let handlers = {};

		this.handleStateUpdate = (propName) => {
			const handlerKey = 'stateUpdate:' + propName;
			if(handlers[handlerKey]){
				return handlers[handlerKey];
			}

			const stateUpdateHandler = (value) => this.setState({ [propName]: value });

			// This helps when using debugger tools!
			Object.defineProperty(stateUpdateHandler, 'name', {value: handlerKey});

			handlers[handlerKey] = stateUpdateHandler;

			return stateUpdateHandler;
		};
	}
}