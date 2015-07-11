conf:{
    "root": "modo",
    "title": "modo.MultiPicker",
    "constructor": true,
    "file": "",
    "key": "ref:multipicker"
}:conf

#modo.MultiPicker

If you need the user to choose a couple of options from a pool of given values, utilize a Multipicker element.

Every value from the pool can be only chosen once.

demo:{
    "target": "en/multipicker/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.MultiPicker(params):modo.MultiPicker {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["elements", "A Object, Array or Backbone Collection with elements to be used as a pool to pick from."],
["selected", "Pass an array to define a set of pre-selected elements. The array must contain indexes when you use a array as pool, keys if you use a object as pool or ids/cids when you use a Backbone Collection."],
["[buttonLabel]", "The label for the 'Add' button. Defaults to `+`"],
["[selectedRender]", "Render function for the selected items. The default function can handle Objects and Arrays containing strings. Implement your own when using a Backbone Collection with models."],
["[pickMenuRender]", "Render function for the available items menu. The default function can handle Objects and Arrays containing strings. Implement your own when using a Backbone Collection with models."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###_settings:Object {.property}
Settings object, used by the element. This will be set by the element constructor and should not be changed
manually.

###_selectedList:modo.List {.property}
Reference to the [modo.List](list) element used by the MultiPicker.

###_pickButton:modo.Button {.property}
Reference to the [modo.Button](button) element used to open the Dropdown to pick elements.

###_pickMenu:modo.List {.property}
Reference to the [modo.List](list) element used to display a list of selectable elements to the user.

|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###set(elements, [options]):this {.method}
Pass an array of keys to set the selected items for this element.

This triggers the Backbone Events `change` and `change:selected`. If you want to avoid the triggering
of the Events, pass `{silent:true}` as the options parameter.

###get():array {.method}
Returns the keys of the currently selected items.

###setElements(elements, [options]):this {.method}
Sets a new pool of items for the user to pick from. Please note that all previously selected keys are discarded
when you set a new item pool. Pass either an `Array`, `Object`, or instance of `Backbone.Collection` as a item
pool.

This triggers the Backbone Events `change` and `change:elements`. If you want to avoid the triggering
of the Events, pass `{silent:true}` as the options parameter.

###getElements():mixed {.method}
Returns the previously set pool of items.

###update():this {.method}
Will trigger a redraw of the element. Normally not necessary to be called manually.

|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the elements selection and/or item pool has been changed through calls to `set()` or `setElements()`
or user interaction.

###change\:selected {.event}
Fired, when the selected items have been changed.

###change\:elements {.event}
Fired, when the pool of selectable items have been changed.

|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-multipicker {.css}
Applied to the UI element.

###mdo-multipicker-selected {.css}
Applied to the list, containing the selected items.

###mdo-multipicker-button {.css}
Applied to the button that opens the menu of available items to select.

###mdo-multipicker-menu {.css}
Applied to the list, containing the selectable items.

###mdo-multipicker-menu-container {.css}
Applied to the DIV surrounding both the pick-button and the pool list. This is necessary
to display the pool list as a dropdown menu.

|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import