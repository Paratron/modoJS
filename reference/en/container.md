conf:{
    "root": "modo",
    "title": "modo.Container",
    "constructor": true,
    "file": "",
    "key": "ref:container"
}:conf

#modo.Container

A modo container can contain child elements.
It brings functions for quickly adding/removing other (modo) Element based objects, as well as giving them an orientation.

demo:{
    "target": "en/container/",
    "display": [
        "programmatic.js",
        "declarative.js",
        "style.css"
    ],
    "editable": true
}:demo

Containers - by default - are invisible layouting elements. For the purpose of this demo, a dashed
border has been added for demonstration.

##Constructor
###modo.Container(params):modo.Container {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[layout]", "Define here, if contained elements should be layed out in Block (`modo.Container.NORMAL`) or Inline-Block (`modo.Container.INLINE`) mode, by default. Default: modo.Container.NORMAL"],
import:"reference>element.md>constructor":import|endimportmarker:constructor|
]]

##Properties
|importmarker:properties|
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###add(element, ..., [options]):this {.method}
Use this function to add one or more modo / jQuery / DOM elements to the container. Will trigger the Backbone Event "add", unless `{silent: true}` is passed as option object.

###remove(element, ..., [options]):this {.method}
This will remove one or more elements from the container. Either pass a modo element here, to get it removed from the container, or pass a jQuery selector to remove a DOM element.

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import
|endimportmarker:methods|

##Events
|importmarker:events|
###add {.event}
Triggered, when a child has been added through `add()`
[[
	["Event Parameter", "Description"],
	["childElement", "Can be either a modo element, a jQuery enhanced DOM object, or a DOM object"]
]]

###remove {.event}
Triggered, when a child has been removed through `remove()`
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-container {.css}
Applied to the modo element.

###mdo-container-layout-normal {.css}
Applied when horizontal container layout is configured.

###mdo-container-layout-inline {.css}
Applied when vertical container layout is configured.

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import
|endimportmarker:css|