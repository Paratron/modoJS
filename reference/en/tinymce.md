conf:{
    "root": "modo",
    "title": "modo.TinyMCE",
    "constructor": true,
    "file": "",
    "key": "ref:tinymce"
}:conf

#modo.TinyMCE

A modo element wrapper for the [TinyMCE text editor](http://www.tinymce.com/). It also implements
the full get/set functionality to be used inside a [FormContainer](formcontainer).

This element definition will automatically try to load the TinyMCE sources from the [Cachefly CDN](http://cachefly.com).

Make sure to include the tinyMCE source manually before loading this module if you want to use a local
copy of tinyMCE, instead of a hosted one.

<div class="alert">
This element is currently under development.<br>
If you have suggestions about functionality, please leave a comment below.
</div>
<br>

<style>
    .inlineDemo{
        height: 370px !important;
    }
</style>

demo:{
    "target": "en/tinymce/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.TinyMCE(params):modo.TinyMCE {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[config]", "A [config object](http://www.tinymce.com/wiki.php/Configuration) like you would pass it to tinyMCE. Each instance of a tinyMCE element can have its own configuration."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###_tinyMCE:object {.property}
Reference to the tinyMCE editor object.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###get():string {.method}
Returns the editor contents.

###set(value, [options]):this {.method}
Will set the editor contents to the given value. Triggers a `change` event unless you pass `{silent: true}` as a option object. 

|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the elements value has been changed through `set()` or a user input.

|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-tinymce {.css}
Applied on the element.
|endimportmarker:css|


####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import