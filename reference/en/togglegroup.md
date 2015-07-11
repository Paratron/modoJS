conf:{
    "root": "modo",
    "title": "modo.ToggleGroup",
    "constructor": true,
    "file": "",
    "key": "ref:togglegroup"
}:conf

#modo.ToggleGroup

The Toggle Group is a special type of container which can only contain elements of type [modo.ToggleButton](togglebutton).
There can be only one toggled Button in a Toggle Group at a time. If you toggle another (by script or user-interaction),
the previously toggled button gets un-toggled.

demo:{
    "target": "en/togglegroup/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.ToggleGroup(params):modo.ToggleGroup {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[untoggle]", "Should always one element be toggled, or can all elements be untoggled? default: `false`"],
["[elements]", "Pass an array with key:value pairs in here, to create toggle buttons upon creation.

Example:

    {
        \"key1\": \"Label 1\",
        \"key2\": \"Label 2\"
    }"],
["[selectedItem]", "Pre-define, which key should be selected upon creation. Only use this when using the `elements` attribute."],
["[collection]", "Pass a Backbone.Collection in here, to create the buttons from. The IDs of the contained Backbone.Models will be used as key, whereas the Model property defined with the `pluck` attribute will be used as button label."],
["[pluck]", "Required when passing in a Backbone.Collection. This string defines, which Model property should be used as button label."],
["[updateOn]", "Only has an effect, when using the `collection` attribute. This controls at which collection events the element should re-create its buttons. Default: `add change remove sort`"],|endimportmarker:constructor|
import:"reference>container.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Container](container)
import:"reference>container.md>properties":import

##Methods
|importmarker:methods|
###add(obj):this {.method}
Use this function to add one or more [modo.ToggleButton](togglebutton) elements to the container. Will trigger the Backbone Event "add".

__Heads up!__ The add function cannot be used like `add()` of a [modo.Container](container) or [modo.FlexContainer](flexcontainer).
Elements added to a ToggleGroup need to recieve a key, which identifies each element inside the group.

To add one or more elements to the ToggleGroup, create them beforehand and pass them to the `.add()` function inside a object:

	my_example_toggle_group.add({
		key1: myFirstToggleButton,
		key2: anotherToggleButton
	});

------

__Short-Hand Usage__
The add function can be used in short-hand mode. Pass a JavaScript object of strings to the function, to generate ToggleButtons automatically. Example:

	{
		button1: 'My first button',
		button2: 'My second button'
	}

This way you are not able to attach custom classes or event listeners on construction time.

###remove(key):this {.method}
This will remove an element from the container. Either pass its key (string), or an array of keys to remove.

###get():string {.method}
Returns the currently selected key of the group.

###getElements():object {.method}
Returns the object that contains references to all contained elements.

###getElementByKey(key):modo.ToggleButton {.method}
Returns the reference to the button element with the given id, if it exists.

###set(key):this {.method}
Will toggle the button with the given key. This triggers the Backbone Event `change`.
|endimportmarker:methods|

####Inherited Methods from [modo.Container](container)
import:"reference>container.md>methods":import

##Events
|importmarker:events|
###change(key) {.event}
Triggered, when a user clicked on one of the contained [modo.ToggleButton](ref/togglebutton)s, the selection has been changed by calling `set(key)` on the group, or by calling `.set(true)` on one of the contained ToggleButton elements.

###add(child_element) {.event}
Triggered, when a child has been added through `add()`
[[
	["Event Parameter", "Description"],
	["child_element", "A JavaScript object with both the elements key, and the element. Example: `{key:element}`"]
]]

###remove(child_element) {.event}
Triggered, when a child has been removed through `remove()`
[[
	["Event Parameter", "Description"],
	["child_element", "A JavaScript object with both the elements key, and the element. Example: `{key:element}`"]
]]
|endimportmarker:events|

####Inherited Events from [modo.Container](container)
import:"reference>container.md>events":import

##CSS Classes
|importmarker:css|
###mdo-togglegroup {.css}
Applied on the element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Container](container)
import:"reference>container.md>css":import