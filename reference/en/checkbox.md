conf:{
    "root": "modo",
    "title": "modo.Checkbox",
    "constructor": true,
    "file": "",
    "key": "ref:checkbox"
}:conf

#modo.Checkbox

A CheckBox Element. It can either have a label, or not. Bindable to Backbone.Model objects.
By default, a HTML input checkbox element is used. However - if you need to style your checkboxes, you can always
set `custom = true` when creating a checkbox, so a DIV will be used instead of the HTML input element.

demo:{
    "target": "en/checkbox/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Checkbox(params):modo.Checkbox {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[label]", "A label to be placed next to the checkbox"],
["[tooltip]", "A tooltip to be applied on the button - will be displayed on mouse over."],
["[custom]", "Set to `true`, to use a span tag rather than an `input[type=checkbox]` tag to have more styling options."],
["[model]", "Set a model here to bind the checkboxes value to a Backbone.Model property (type should be Boolean)"],
["[modelKey]", "This is mandatory for using the `model` parameter. This is the string key of the models property to use"],
["[value]", "Optionally set an initial value for the checkbox. (`true`/`false`)"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###value:Bool {.property}
Can be used to retrieve the current check status of the object.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###enable():this {.method}
Enables the button to capture clicks. Removes the CSS-Class `mdo-disabled` from its DOM element. Triggers the Backbone Event "enabled".

###disable():this {.method}
Disables the button to not capture any clicks. Adds the CSS-Class `mdo-disabled` to its DOM element. Triggers the Backbone Event "disabled".

###set(value):this {.method}
Pass true or false here to change the elements value manually.
If the element is bound to a model, the models property will be changed as well.

###get():boolean {.method}
Returns the current value.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the elements value has been changed through `set()`.

###click {.event}
Triggered, when the button is enabled and a user has clicked on it.
[[
	["Event parameter", "Description"],
	["event", "The click event object"]
]]

###enabled {.event}
Triggered, when the button has been enabled through `enable()`.

###disabled {.event}
Triggered, when the button has been disabled through `disable()`.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-checkbox {.css}
Applied on the element.
Also applied to a `span` tag inside the element to act as a checker when the `custom` property has been set to true.

###mdo-checkbox-label {.css}
Applied to a `span` tag to act as a label.

###mdo-checked {.css}
Applied to the element when the elements value is set to `true`.

###mdo-disabled {.css}
Applied when the element has been disabled through `disable()`. Will be removed after
a call to `enable()`.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import