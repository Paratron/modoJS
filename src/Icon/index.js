import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	name: PropTypes.string,
};

const defaultProps = {
	name: 'done',
};

let initialized = false;

function init(){
	if(initialized){
		return;
	}

	initialized = true;

	if(Icon.useHostedIcons){
		return;
	}

	const l = document.createElement('link');
	l.type = 'text/css';
	l.rel = 'stylesheet';
	l.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
	document.head.appendChild(l);
}

export default class Icon extends React.Component {
	constructor(props) {
		super(props);
		init();
	}

	render() {
		const classNames = ['mdo-icon', 'material-icons'];

		return (
			<i className={classNames.join(' ')}>{this.props.name.replace(/ /g, '_').toString()}</i>
		);
	}
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;
Icon.useHostedIcons = false;