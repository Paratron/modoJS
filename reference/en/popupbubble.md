conf:{
    "root": "modo",
    "title": "modo.PopUpBubble",
    "constructor": true,
    "file": "",
    "key": "ref:popupbubble"
}:conf

#modo.PopUpBubble

A PopUp Bubble behaves a bit like a tooltip. It looks like a balloon, or a speech bubble and can be attached to
Modo elements or fixed positions on the screen.

When opened, the PopUp Bubble will appear and can close itself when the user clicks somewhere on the screen.

The most useful feature of the PopUp Bubble is its capability to attach itself relatively to another Modo element.

The PopUpBubble is an extension of [modo.PopUp](popup).

demo:{
    "target": "en/popupbubble/",
    "display": [
        "programmatic.js",
        "declarative.js",
        "ui.css"
    ],
    "editable": true
}:demo

##Constructor
###modo.PopUpBubble(params):modo.PopUpBubble {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[autohide]", "Enable or disable the element to be automatically hidden when the user clicks somewhere in the application. Default: `true`"],

["[animate]", "If set to true, the PopUp will use jQuerys `fadeIn()` and `fadeOut()` methods for showing and hiding the PopUp"],
["[keyboard]", "When set to true, a hit on the keyboards ESC key will close the window. Default: true"],
["[showEffect]", "Function to be called when the element should be shown. Called when `animate = true`. The function gets a reference to the DOM element passed as first parameter."],
["[hideEffect]", "Function to be called when the element should be hidden. Called when `animate = true`. The function gets a reference to the DOM element passed as first parameter."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.PopUp](element)
import:"reference>popup.md>properties":import

##Methods
|importmarker:methods|
###attach(targetElement, position):this {.method}
Attaches the PopUp Bubble to a interface element.
Call `open()` afterwards to display the PopUp Bubble.

`targetElement` can be any Modo Element and any DOM element.

`position` can be one of the following string values:

[[
["Value", "Description"],
["`tl`", "Attach on top, direction left"],
["`tc`", "Attach on top, align centered"],
["`tr`", "Attach on top, direction right"],
["`lt`", "Attach to the left, direction up"],
["`lc`", "Attach to the left, align centered"],
["`lb`", "Attach to the left, direction down"],
["`rt`", "Attach to the right, direction up"],
["`rc`", "Attach to the right, align centered"],
["`rb`", "Attach to the right, align down"],
["`bl`", "Attach on bottom, direction left"],
["`bc`", "Attach on bottom, align centered"],
["`br`", "Attach on bottom, direction right"]
]]
|endimportmarker:methods|

####Inherited Methods from [modo.PopUp](element)
import:"reference>popup.md>methods":import

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