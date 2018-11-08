import React, {useState, useEffect} from 'react';

/**
 * Will vertically center its content on screen, if the screen
 * @param children
 * @returns {*}
 * @constructor
 */
const VerticallyCentered = ({children, className}) => {
	const classNames = ['mdo-centered'];
	const outerRef = React.createRef();
	const innerRef = React.createRef();
	const [overHeight, setOverHeight] = useState(false);

	if (overHeight) {
		classNames.push('has-overheight');
	}

	if (className) {
		classNames.push(className);
	}

	useEffect(() => {
		const overHeightHandler = () => {
			const outerBounding = outerRef.current.getBoundingClientRect();
			const innerBounding = innerRef.current.getBoundingClientRect();

			setOverHeight(outerBounding.height > innerBounding.height);
		};

		document.addEventListener('resize', overHeightHandler);
		overHeightHandler();

		return function cleanup(){
			document.removeEventListener('resize', overHeightHandler);
		};
	}, [overHeight]);

	return (
		<div className={classNames.join(' ')} ref={outerRef}>
			<div ref={innerRef}>
				{children}
			</div>
		</div>
	);
};

export default VerticallyCentered;
