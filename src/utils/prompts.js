import React from 'react';
import ReactDOM from 'react-dom';

import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogFooter
} from '../Dialog';

import Button from '../Button';
import TextInput from '../TextInput';

let portal;

class App extends React.Component {
	constructor(props) {
		super(props);
		portal = this;

		this.state = {
			type: 0, // 0 = Alert, 1 = Confirm, 2 = Prompt
			show: false,
			title: '',
			message: '',
			btnConfirm: null,
			btnCancel: null,
			defaultValue: '',
			textValue: '',
			className: null,
			placeholder: '',
		};

		this.confirm = () => {
			this.setState({show: false});
			this.state.resolve();
		};

		this.cancel = () => {
			this.setState({show: false});
			this.state.reject();
		};

		this.update = (props) => {
			this.setState(props);
		};

		this.handleClose = () => {
			if(this.state.show === true){
				this.cancel();
			}
		};

		this.handleChange = (textValue) => this.setState({textValue});
	}

	render() {
		const classNames = ['mdo-prompt'];

		const {
			type,
			show,
			title,
			message,
			btnConfirm,
			btnCancel,
			textValue,
			defaultValue,
			placeholder,
			className,
		} = this.state;

		switch (type) {
			case 0:
				classNames.push('mdo-alert');
				break;
			case 1:
				classNames.push('mdo-confirm');
				break;
			case 2:
				classNames.push('mdo-prompt');
		}

		if (className) {
			classNames.push(className);
		}

		return <Dialog className={classNames.join(' ')} show={show} onClose={this.handleClose}>
			{title && (
				<DialogHeader>
					<h3>{title}</h3>
				</DialogHeader>
			)}
			<DialogContent>
				{message}
				{type === 3 && (
					<TextInput
						onEnter={this.confirm}
						value={textValue || defaultValue}
						placeholder={placeholder}
						onChange={this.handleChange}
					/>
				)}
			</DialogContent>

			{(btnCancel || btnConfirm) && (
				<DialogFooter>
					{btnCancel && <Button onClick={this.cancel}>{btnCancel}</Button>}
					{btnConfirm && <Button type={Button.TYPES.PRIMARY} onClick={this.onConfirm}>{btnConfirm}</Button>}
				</DialogFooter>
			)}
		</Dialog>;
	}
}

ReactDOM.createPortal(<App/>, document.body);

export function prompt(props) {

}

export function alert(props) {

}

/**
 * Will open an alert box, asking for confirmation.
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {string} [props.btnConfirm="OK"]
 * @param {string} [props.btnCancel="Cancel"]
 * @returns {Promise<any>}
 */
export function confirm(props) {
	const promise = new Promise((resolve, reject) => {
		portal.update(Object.assign({
			btnConfirm: 'OK',
			btnCancel: 'Cancel'
		}, props, {
			type: 1,
			resolve,
			reject
		}));
	});

	promise.cancel = portal.cancel;

	return promise;
}

export default {
	prompt,
	alert,
	confirm,
};
