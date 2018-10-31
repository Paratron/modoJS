import React from 'react';

import 'modo/modo.css';
import 'modo/themes/modern.css';

import {
	Button,
	Table,
	GridFrame,
	Grid,
	Cell,
	Drawer,
	AppBar,
	Dialog,
	DialogHeader,
	DialogContent,
	List
} from 'modo';


const data = [
	{
		firstName: 'Peter',
		lastName: 'Schmitt',
		birthDay: 12312312312
	},
	{
		firstName: 'Simone',
		lastName: 'Just',
		birthDay: 13121231212
	},
	{
		firstName: 'Andreas',
		lastName: 'Schwan',
		birthDay: 11212312312
	},
	{
		firstName: 'Simon',
		lastName: 'Meyer',
		birthDay: 144141112312
	},
];

const BirthdayComp = (props) => {
	const d = new Date();
	d.setTime(parseInt(props.children, 10) * 1000);

	return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
};

export default class App extends React.Component {
	state = {
		dialogOpen: false
	};

	openDialog = () => {
		this.setState({dialogOpen: true});
	};

	closeDialog = () => {
		this.setState({dialogOpen: false});
	};

	render() {
		return (
			<GridFrame>
				<AppBar>
					<h1>Headline</h1>
				</AppBar>
				<Cell>
					<Grid fullHeight={true}>
						<Drawer>
							The left drawer
						</Drawer>
						<Cell>
							<Button onClick={this.openDialog}>Open a Dialog!</Button>
							<Table data={data} onRowClick={console.log}>
								{{
									firstName: {
										title: 'Vorname',
										sortFunc: Table.basicSort,
									},
									lastName: {
										title: 'Nachname',
										sortFunc: Table.basicSort
									},
									birthDay: {
										title: 'Geburtstag',
										sortFunc: Table.basicSort,
										component: BirthdayComp,
									}
								}}
							</Table>
						</Cell>
					</Grid>
				</Cell>
				<Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
					<DialogHeader>
						<h2>A Dialog</h2>
					</DialogHeader>
					<DialogContent>
						This is my dialog content...
					</DialogContent>
				</Dialog>
			</GridFrame>
		);
	}
}
