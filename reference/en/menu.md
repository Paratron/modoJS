conf:{
    "root": "modo",
    "title": "modo.Menu",
    "constructor": true,
    "file": "",
    "key": "ref:menu",
    "review": true
}:conf

#modo.Menu

The Modo Menu Element provides you drop down style menus known
from virtually any kind of desktop application.
Menu items support display of:

- Icons
- Hotkeys
- Sub-Menus
- Quick-Access keys
- Checkboxes
- Radio buttons
- Separators

Menus can be either navigated by mouse, or keyboard.
Menus can be either rendered with a base level (first level
of the menu is rendered as horizontal list), or as a single
list that can be spawned anywhere.

demo:{
    "target": "en/menu/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Label(params):modo.Label {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[value]", "A initial value for the label, OR a function that returns a value. The function is called when you bind the element to a Backbone Model and want to generate the elements value from that model.

Example:

    value: function(model){
        return model.get('firstName') + ' ' + model.get('lastName');
    }
"],
["[model]", "Set a model here to bind the labels value to a Backbone.Model property (type should be string)"],
["[modelKey]", "This, or a value function is mandatory for using the `model` parameter. This is the string key of the models property to use"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###set(value) {.method}
Pass a string to get it displayed in the labels DOM element. The string can contain HTML tags.
Will trigger the Backbone Event "change".

###get() {.method}
Returns the current label value.
|endimportmarker:methods|

###bindToModel(model, [modelKey=null], [processingFunction=null], [noUpdate=false]):this {.method}
Binds the element to a Backbone Model. Previous bindings will be detached.
If you don't want (or can't) give a modelKey to bind to, you need to provide a processing function
that turns a value of the model into a string to be displayed by the label.

The noUpdate parameter means that you don't want to update the labels currently displayed value when
binding to a model but wait for later model updates.

If the model fires a `change` event, the label will be updated.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered, when the labels value has been changed through .set()
[[
["Event Parameter", "Description"],
["value", "The new value of the label"]
]]
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-label {.css}
Applied to the element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import