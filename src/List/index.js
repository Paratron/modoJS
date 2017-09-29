import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

const listItemClass = 'mdo-list-item';
const activeListItemClass = 'mdo-active';

const DefaultListItemComponent = (props) => {
	const {
		children,
		onClick,
		icon
	} = props;

	let className = props.className;

	if (icon) {
		className += ' mdo-has-icon';

		return (
			<div className={className} onClick={onClick}>
				<Icon name={icon}/>
				<span className="content">
					{children}
				</span>
			</div>
		);
	}

	return (
		<div onClick={onClick}>
			{children}
		</div>
	);
};

const makeItem =
	(Tag, key, content, data, value, clickHandler, className) => {
		const classNames = [listItemClass];

		if (value === key) {
			classNames.push(activeListItemClass);
		}

		if (className) {
			classNames.push(className);
		}

		return (
			<Tag
				{...data}
				className={classNames.join(' ')}
				onClick={clickHandler}
				key={key}
			>
				{content}
			</Tag>
		);
	};

const propTypes = {
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	itemComponent: PropTypes.oneOfType([PropTypes.func]),
	keyPropName: PropTypes.string,
	propName: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string,
	enabled: PropTypes.bool,
	className: PropTypes.string,
};

const defaultProps = {
	items: {},
	itemComponent: DefaultListItemComponent,
	keyPropName: 'id',
	propName: 'title',
	onClick: null,
	enabled: true,
	className: null,
};

export default class List extends React.Component {
	constructor(props) {
		super(props);

		const handlers = {};

		this.handleClick = (index) => {
			if (!this.props.onChange) {
				return null;
			}

			if (handlers[index]) {
				return handlers[index];
			}

			const clickHandler = () => {
				if (this.props.items instanceof Array) {
					this.props.onChange(this.props.items[index][this.props.keyPropName]);
					return;
				}
				this.props.onChange(Object.keys(this.props.items)[index]);
			};

			handlers[index] = clickHandler;

			return clickHandler;
		};
	}

	render() {
		const classNames = ['mdo-list'];

		const {
			items,
			itemComponent,
			propName,
			keyPropName,
			onChange,
			enabled,
			className,
			value,
		} = this.props;

		if (onChange) {
			classNames.push('mdo-clickable');
		}

		if (!enabled) {
			classNames.push('mdo-disabled');
		}

		if (className) {
			classNames.push(classname);
		}

		const elements = items instanceof Array
			? items.map((d, index) => makeItem(itemComponent, d[keyPropName], d[propName], d, value, this.handleClick(index)))
			: Object.keys(items).map((key, index) => makeItem(itemComponent, key, items[key][propName], items[key], value, this.handleClick(index)));

		return (
			<div className={classNames.join(' ')}>
				{elements}
			</div>
		);
	}
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;