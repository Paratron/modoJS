import React, {useEffect} from 'react';

window.reactM = React;

const FullScreenApp = ({children}) => {
	useEffect(() => {
		document.body.parentElement.classList.add('mdo-fullscreen');

		return function cleanup(){
			document.body.parentElement.classList.remove('mdo-fullscreen');
		}
	});

	return <div>{children}</div>;
};

export default FullScreenApp;
