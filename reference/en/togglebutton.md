conf:{
    "root": "modo",
    "title": "modo.ToggleButton",
    "constructor": true,
    "file": "",
    "key": "ref:togglebutton"
}:conf

#modo.ToggleButton

This is a normal modo button with extra functionality - it can be toggled by click, or manually with the `set()` function.

Use this element to represent a true/false value.

demo:{
    "target": "en/togglebutton/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.ToggleButton(params):modo.ToggleButton {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
import:"reference>button.md>constructor":import[]
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Button](button)
import:"reference>button.md>properties":import

##Methods
|importmarker:methods|
###get():boolean {.method}
Returns the buttons' current toggle status (true/false).

###set([value]):this {.method}
Sets the button either to toggled, or not toggled (pass true or false).
Omit the parameter to swith the buttons current state.

###lock([value]):this {.method}
Locks, or unlocks the button for user interaction. Pass true or false to the method to lock, or unlock it.
If the value is omitted, the button will be locked.

A locked button cannot be toggled by user interaction; only through the `set()` method.
|endimportmarker:methods|

####Inherited Methods from [modo.Button](button)
import:"reference>button.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the button state changed.

####Inherited Events from [modo.Button](button)
import:"reference>button.md>events":import
|endimportmarker:events|

##CSS Classes
|importmarker:css|
###mdo-togglebutton {.css}
Applied to the element itself.

###mdo-toggled {.css}
Applied, when the elements value is `true` (toggled).
|endimportmarker:css|

####Inherited CSS Classes from [modo.Button](button)
import:"reference>button.md>css":import