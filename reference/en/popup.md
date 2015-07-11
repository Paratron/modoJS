conf:{
    "root": "modo",
    "title": "modo.PopUp",
    "constructor": true,
    "file": "",
    "key": "ref:popup"
}:conf

#modo.PopUp

A PopUp Element can be used to display content on top of any other content in the application.
Its easy to emulate "windows" or dialogs in your application with the PopUp Element.

A modo PopUp can be placed anywhere on the screen - it don't has to be added to a specific container or element (in fact, it can't).

You can display a modo PopUp either in normal, or modal mode (this displays a mask that blocks access to underlying elements).
Modal popups are stackable - so a newly opened modal PopUp will lay itself over previously opened modal PopUps.

The modo PopUp element is designed to be very basic - so you might want to create your own dialog interface
element that extends the basic PopUp with a title bar or action buttons.

demo:{
    "target": "en/popup/",
    "display": [
        "programmatic.js",
        "declarative.js",
        "ui.css"
    ],
    "editable": true
}:demo

##Constructor
###modo.PopUp(params):modo.PopUp {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[animate]", "If set to true, the PopUp will use jQuerys `fadeIn()` and `fadeOut()` methods for showing and hiding the PopUp"],
["[modal]", "If set to true, a mask will be applied under the PopUp, which blocks user access to all underlying elements. Default: false"],
["[keyboard]", "When set to true, a hit on the keyboards ESC key will close the window. Default: true"],
["[closeOnBackdrop]", "When set to true, a click on the mask behind the PopUp will close it. Only neccessary for modal PopUps. Default: true"],
["[showEffect]", "Function to be called when the element should be shown. Called when `animate = true`. The function gets a reference to the DOM element passed as first parameter."],
["[hideEffect]", "Function to be called when the element should be hidden. Called when `animate = true`. The function gets a reference to the DOM element passed as first parameter."],|endimportmarker:constructor|
import:"reference>container.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Container](container)
import:"reference>container.md>properties":import

##Methods
|importmarker:methods|
###open():this {.method}
Will display the PopUp on screen. This triggers the Backbone Event "open".

###close():this {.method}
Will hide the PopUp from screen. This triggers the Backbone Event "close".

###move(x,[y]):this {.method}
Sets the window to a specific position on screen. Either pass x and y value separately, or a JavaScript Object with x and y attributes. Triggers the Backbone Event "move".

This will be assigned to CSS properties, so all valid CSS position values will work.

###isOpen():bool {.method}
Returns either true or false when the window is currently open or closed.
|endimportmarker:methods|

####Inherited Methods from [modo.Container](container)
import:"reference>container.md>methods":import

##Events
|importmarker:events|
###open {.event}
Triggered, when the PopUp has been displayed through calling `open()`.

###close {.event}
Triggered, when the PopUp has been hidden through calling `close()`, hitting the `ESC` key on the keyboard (with the constructor parameter `keyboard` set)
or clicking of the background mask of a modal dialog (with constructor parameter `closeOnBackdrop` set to true).

###move(x,y) {.event}
Triggered, when the PopUp has been moved through calling `move()`.
|endimportmarker:events|

####Inherited Events from [modo.Container](container)
import:"reference>container.md>events":import

##CSS Classes
|importmarker:css|
###mdo-popup {.css}
Applied to the popup container.

###mdo-popup-level-[number] {.css}
Dynamic class, applied to the popup based on the number of other popups that are displayed "below" it.

###mdo-popup-mask {.css}
Applied to the element thats displayed behind the popup container in modal mode.

###[customClassName]-mask {.css}
This className is automatically created, when you assign a custom className to the PopUp, via the `className`
constructor parameter. If for example, the custom className `myWindow` is used, the mask element gets the class
`myWindow-mask` attached.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Container](container)
import:"reference>container.md>css":import