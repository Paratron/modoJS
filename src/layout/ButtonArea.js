import React from 'react';

import Grid from './Grid';
import Cell from './Cell';

const ButtonArea = ({children}) => {
	const classNames = ['mdo-buttonarea'];
	const numChildren = React.Children.count(children);

	return (
		<Grid className={classNames.join(' ')}>
			{React.Children.map(children, (c, i) => <Cell textAlign={i === numChildren - 1 ? 'right' : 'left'}>{c}</Cell>, this)}
		</Grid>
	);
};

export default ButtonArea;
