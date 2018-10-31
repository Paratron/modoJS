import React from 'react';
import { Button } from 'modo';

class Example extends React.Component {
	render(){
		return (
			<div>
				<Button label="I am a default Button" /> <br />
				<Button type={Button.TYPES.PRIMARY}>
					Primary Button!
				</Button> <br />

			</div>
		);
	}
}
