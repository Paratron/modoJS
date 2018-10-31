import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const propTypes = {
	children: PropTypes.node,
};

export default class TabGroup extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: 0
		};

		const handlers = {};

		this.changeHandler = (index) => {
			if (handlers[index]) {
				return handlers[index];
			}

			const handler = () => this.setState({active: index});

			handlers[index] = handler;

			return handler;
		};
	}

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
						<Button
							key={labelText}
							className={`mdo-tab-selector${ i === active ? ' mdo-active' : ''}`}
							onClick={this.changeHandler(i)}
							type={Button.TYPES.MINIMAL}
						>
							{labelText}
						</Button>
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
