import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
};

export default class TabGroup extends React.Component {
	state = {
		active: 0
	};

	handlers = {};

	changeHandler = (index) => {
		if (this.handlers[index]) {
			return this.handlers[index];
		}

		const handler = () => this.setState({active: index});

		this.handlers[index] = handler;

		return handler;
	};

	render() {
		const classNames = ['mdo-tabgroup'];

		const {
			children
		} = this.props;

		const {
			active
		} = this.state;

		const labels = React.Children.map(children, c => c.props.label);

		return (
			<div className={classNames.join(' ')}>
				<div className="mdo-tab-selectors">
					{labels.map((labelText, i) => (
						<button
							key={labelText}
							className={`mdo-tab-selector${ i === active ? ' mdo-active' : ''}`}
							onClick={this.changeHandler(i)}
						>
							{labelText}
						</button>
					))}
				</div>
				<div className="mdo-tab-content">
					{React.Children.map(children, (c, i) => React.cloneElement(c, {active: i === active}))}
				</div>
			</div>
		);
	}
}

TabGroup.propTypes = propTypes;
