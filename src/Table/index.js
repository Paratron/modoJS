import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	className: PropTypes.string,
	children: PropTypes.object,
	showHeader: PropTypes.bool,
	onRowClick: PropTypes.func,
	data: PropTypes.array,
	defaultCellComponent: PropTypes.any,
};

const nullFunc = () => {
};

const defaultProps = {
	className: '',
	children: {},
	showHeader: true,
	onRowClick: nullFunc,
	data: [],
	defaultCellComponent: ({row, columnKey}) => <span>{row[columnKey]}</span>
};

export default class Table extends React.Component {
	constructor(props) {
		super(props);

		const c = props.children;
		const firstSorter = Object.keys(c).reduce((acc, key) => acc ? acc : c[key].sortFunc ? key : null, null);
		this.lastData = props.data;

		this.sortCallbacks = {};
		this.state = {
			sortField: firstSorter,
			sortDirection: 1
		};

		this.updateSort = (key) => {
			if (this.sortCallbacks[key]) {
				return this.sortCallbacks[key];
			}

			const cb = () => {
				if (this.state.sortField === key) {
					this.setState({sortDirection: this.state.sortDirection * -1});
					return;
				}
				this.setState({sortField: key, sortDirection: 1});
			};

			this.sortCallbacks[key] = cb;

			return cb;
		};

		this.handleRowClick = (e) => {
			const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
			if (props.onRowClick) {
				props.onRowClick(this.lastData[index], index);
			}
		};
	}

	render() {
		const {
			data,
			children,
			className,
			showHeader,
			onRowClick,
			defaultCellComponent: DefaultCellComponent
		} = this.props;

		const {
			sortField,
			sortDirection
		} = this.state;

		const classNames = ['mdo-table'];
		const columns = Object.keys(children).map(key => Object.assign(children[key], {key}));

		if (onRowClick !== nullFunc) {
			classNames.push('mdo-clickable');
		}

		if (className) {
			classNames.push(className);
		}

		if (sortField && children[sortField].sortFunc) {
			data.sort((rowA, rowB) => children[sortField].sortFunc(rowA[sortField], rowB[sortField]));
			if (sortDirection === -1) {
				data.reverse();
			}
		}

		this.lastData = data;

		return (
			<table className={classNames.join(' ')}>
				{showHeader && (
					<thead>
					<tr>
						{columns.map(c => {
							const classNames = [`mdo-table-head mdo-column-${c.key}`];

							if (c.sortFunc) {
								classNames.push('mdo-sortable');
							}

							if (sortField === c.key) {
								classNames.push('mdo-sort-' + (sortDirection === 1 ? 'asc' : 'desc'));
							}
							return <th className={classNames.join(' ')} onClick={this.updateSort(c.key)}
									   key={c.key}><span>{c.title}</span></th>;
						})}
					</tr>
					</thead>
				)}
				<tbody>{data.map((row, rowIndex) => {
					const rowKey = row.id ? row.id : `r${rowIndex}`;

					return (
						<tr
							className={"mdo-table-row"}
							key={rowKey}
							data-index={rowIndex}
							onClick={this.handleRowClick}
						>
							{
								columns.map((c, ci) => (
									<td className={`mdo-table-cell mdo-column-${c.key}`} key={c.key}>
										{c.component
											? <c.component
												row={row}
												rowIndex={rowIndex}
												columnIndex={ci}
												columnKey={c.key}
											>
												{row[c.key]}
											</c.component>
											: <DefaultCellComponent
												row={row}
												rowIndex={rowIndex}
												columnIndex={ci}
												columnKey={c.key}
											>
												{row[c.key]}
											</DefaultCellComponent>
										}
									</td>
								))
							}
						</tr>
					);
				})}</tbody>
			</table>
		);
	}
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

/**
 * This is a simple basic sort function you may use
 * for your table rows.
 * @param a
 * @param b
 * @returns {number}
 */
Table.basicSort = (a, b) => {
	return a > b
		? 1
		: a < b
			? -1
			: 0;
};

/**
 * This does the same sort like basicSort, but will enforce
 * value treatment as integers.
 * @param a
 * @param b
 * @returns {number}
 */
Table.numericSort = (a, b) => Table.basicSort(parseInt(a, 10), parseInt(b, 10));
