conf:{
    "root": "modo",
    "title": "modo.AceEditor",
    "constructor": true,
    "file": "",
    "key": "ref:aceeditor"
}:conf

#modo.AceEditor

A modo element wrapper for the Ace text editor from [http://ace.c9.io/](http://ace.c9.io/). It also implements
the full get/set functionality to be used inside a [FormContainer](formcontainer).

This element definition will automatically try to load the Ace sources from [MaxCDN](http://osscdn.com/).

Make sure to include the Ace source manually before loading this module if you want to use a local
copy of Ace, instead of a hosted one.

<div class="alert">
This element is currently under development.<br>
If you have suggestions about functionality, please leave a comment below.
</div>
<br>

demo:{
    "target": "en/aceeditor/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.AceEditor(params):modo.AceEditor {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[theme]", "Which theme should be loaded for Ace? . Defaults to `chrome`."],
["[mode]", "The editor mode you want to use. Defaults to `html`."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###_editor:object {.property}
Reference to the ace editor object.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###get():string {.method}
Returns the editor contents.

###set(value, [options]):this {.method}
Will set the editor contents to the given value. Triggers a `change` event unless you pass `{silent: true}` as a option object. 

###setMode(mode, [options]):this {.method}
Sets a new syntax mode for the editor. Triggers a `changeMode` event unless you pass `{silent: true}` as a option object.

###resize():this {.method}
Calls the editors resize method, if the editor has been initialized yet.

|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the elements value has been changed through `set()` or a user input.

###changeMode {.event}
Triggered, when the editors syntax mode has been changed through `setMode()`.

|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-aceEditor {.css}
Applied on the element.
|endimportmarker:css|

___Heads up___: Most styling possibilities take place in ace's css classes. Read more about it in the ace documentation.

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import