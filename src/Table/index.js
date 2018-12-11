import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	className: PropTypes.string,
	children: PropTypes.object,
	showHeader: PropTypes.bool,
	onRowClick: PropTypes.func,
	onSort: PropTypes.func,
	data: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Map)]),
	defaultCellComponent: PropTypes.any,
	start: PropTypes.number,
	limit: PropTypes.number,
	defaultSortColumn: PropTypes.string,
	defaultSortOrder: PropTypes.string,
};

const nullFunc = () => {
};

const defaultProps = {
	className: '',
	children: {},
	showHeader: true,
	onRowClick: nullFunc,
	onSort: nullFunc,
	data: [],
	start: 0,
	limit: 0,
	defaultSortColumn: null,
	defaultSortOrder: 'DESC',
	defaultCellComponent: ({row, columnKey}) => <span>{row[columnKey]}</span>
};

export default class Table extends React.Component {
	constructor(props) {
		super(props);

		const c = props.children;
		const firstSorter = props.defaultSortColumn || Object.keys(c).reduce((acc, key) => acc ? acc : c[key].sortFunc ? key : null, null);
		this.lastData = props.data;

		this.sortCallbacks = {};
		this.state = {
			sortField: firstSorter,
			sortDirection: props.defaultSortOrder === 'DESC' ? -1 : 1,
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
				props.onSort();
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
			data: inData,
			children,
			className,
			showHeader,
			onRowClick,
			start,
			limit,
			defaultCellComponent: DefaultCellComponent
		} = this.props;

		const fullData = (inData instanceof Map)
			? [...inData.values()]
			: inData.slice();

		const {
			sortField,
			sortDirection
		} = this.state;

		if (sortField && children[sortField].sortFunc) {
			fullData.sort((rowA, rowB) => children[sortField].sortFunc(rowA[sortField], rowB[sortField]));
			if (sortDirection === -1) {
				fullData.reverse();
			}
		}

		const data = fullData.slice(start, limit ? Math.min(limit, fullData.length) : fullData.length);

		const classNames = ['mdo-table'];
		const columns = Object.keys(children).map(key => Object.assign(children[key], {key}));

		if (onRowClick !== nullFunc) {
			classNames.push('mdo-clickable');
		}

		if (className) {
			classNames.push(className);
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
					const rowClasses = ['mdo-table-row'];

					const cells = columns.map((c, ci) => {

						if (c.precalc) {
							c.precalc({row, rowIndex, rowClasses});
						}

						return (

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
						);
					});

					return (
						<tr
							className={rowClasses.join(' ')}
							key={rowKey}
							data-index={rowIndex}
							onClick={this.handleRowClick}
						>
							{
								cells
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
