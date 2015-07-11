conf:{
    "root": "modo",
    "title": "modo.Button",
    "constructor": true,
    "file": "",
    "key": "ref:button"
}:conf

#modo.Button

A modo Button captures clicks from a user and re-distributes them as Backbone Events. It can be enabled or disabled.

demo:{
    "target": "en/button/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Button(params):modo.Button {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[label]", "A label to be applied on the button"],
["[tooltip]", "A tooltip to be applied on the button - will be displayed on mouse over."],
["[disabled]", "Set to true, to disable the button initially."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###focus():this {.method}
Sets the user focus to the button (so the button can be triggered with the enter key)

###blur():this {.method}
Removes the focus from the button if any.

###setLabel(label, tooltip):this {.method}
Updates the button label with the given value. Passing a new tooltip is optional.
If you want to set a tooltip, but no new label, simply pass `null` as label value.
Triggers a `update` event.


###enable():this {.method}
Enables the button to capture clicks. Removes the CSS-Class `mdo-disabled` from its DOM element. Triggers the Backbone Event "enabled".

###disable():this {.method}
Disables the button to not capture any clicks. Adds the CSS-Class `mdo-disabled` to its DOM element. Triggers the Backbone Event "disabled".

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import
|endimportmarker:methods|


##Events
|importmarker:events|
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

###update {.event}
Triggered, when the buttons label and/or tooltip has been changed through `setLabel()`.

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import
|endimportmarker:events|


##CSS Classes
|importmarker:css|
###mdo-button {.css}
Applied on the button element.

###mdo-disabled {.css}
Applied when the element has been disabled through `disable()`. Will be removed after
a call to `enable()`.

|endimportmarker:css|
####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import