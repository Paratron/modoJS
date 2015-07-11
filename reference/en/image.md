conf:{
    "root": "modo",
    "title": "modo.Image",
    "constructor": true,
    "file": "",
    "key": "ref:image"
}:conf

#modo.Image

A image object, enhanced by modo methods.
Can - for example - be used inside a modo.FormContainer to display user avatars.

##Constructor
###modo.Image(params):modo.Image {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[value]", "The URL of the image to be loaded."],
["[model]", "A Backbone Model you want to bind the Element to."],
["[modelKey]", "The key of the Backbone Model to be observed on changes. Required when the `model` property is set."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###height:Integer {.property}
The natural (real) height of the image in pixels. This property is automatically set, when an image has been loaded.

###width:Integer {.property}
The natural (real) width of the image in pixels. This property is automatically set, when an image has been loaded.

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

###setBlank():this {.method}
Sets the image src to a transparent image of 1x1 pixel size through a base64 data url.    
Taken from the blog post [The smallest transparent pixel](http://proger.i-forge.net/The_smallest_transparent_pixel/eBQ).

###get():boolean {.method}
Returns the current value.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered when the elements value has been changed through `set()`.

###load {.event}
Triggered after the image has been changed through `set()` and successfully loaded.    
The `width` and `height` properties have already been updated when the event is fired.

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