conf:{
    "root": "modo",
    "title": "modo.FormSlot",
    "constructor": true,
    "file": "",
    "key": "ref:formslot"
}:conf

#modo.FormSlot

The FormSlot element can be used to group child elements besides a label.
While you can use this element everywhere as a container, it gets more useful inside a [modo.FormContainer](formcontainer), since
it will propagate the keys of the added children to the formcontainer as if they have been added directly to it.

The FormContainer Demo is used here again, since it also demonstrates the use of FormSlots.

demo:{
    "target": "en/formcontainer/",
    "notice": "This demo has only a declarative source, because it would be too complex, otherwise.",
    "display": [
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.FormSlot(params):modo.FormSlot {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[label]", "A labeling text to place next to the children of this container"],
import:"reference>container.md>constructor":import
|endimportmarker:constructor|
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Container](container)
import:"reference>container.md>properties":import

##Methods
|importmarker:methods|
###set():this {.method}
Setter for the elements label text.

###get():this {.method}
Getter for the elements label text.

###add(...):this {.method}
Use this function to add one or more modo / jQuery / DOM elements to the container. Will trigger the Backbone Event "add".
Either pass:

- Modo elements directly
- DOM/jQuery elements directly
- Modo elements encapsulated in a object to add them with keys. Example: `{mykey: someModoElement}`

###remove(elm):this {.method}
Either pass the key of a keyed element here, or directly a unkeyed element.
|endimportmarker:methods|

####Inherited Methods from [modo.Container](container)
import:"reference>container.md>methods":import

##Events
|importmarker:events|
###change {.event}
Will be triggered, when the elements label text is changed through `set()`.
|endimportmarker:events|

####Inherited Events from [modo.Container](container)
import:"reference>container.md>events":import

##CSS Classes
|importmarker:css|
###mdo-formslot {.css}
Added to the formslot element.

###mdo-formslot-label {.css}
Added to the label inside the formslot element.

###mdo-formslot-container {.css}
Added to the container that holds the formslot elements children.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Container](container)
import:"reference>container.md>css":import