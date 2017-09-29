/**
 * This function will return a clone of the given object with
 * all properties removed you defined in the stripProps array.
 * @param {object} inObject
 * @param {array} stripProps
 */
export function cloneWithoutProps(inObject, stripProps) {
	let newObject = Object.assign({}, inObject);

	stripProps.forEach(key => {
		delete newObject[key];
	});

	return newObject;
}