conf:{
    "root": "modo",
    "title": "modo.FlexContainer",
    "constructor": true,
    "file": "",
    "key": "ref:flexcontainer"
}:conf

#modo.FlexContainer

The Flex Container does align its children either horizontally or vertically.
It extends the basic [modo.Container](ref/container) with quick, basic layout capabilities.

The Flex Container can be used in two directions: horizontal, or vertical.

####Horizontal layout
All child elements will get 100% height. They will maintain their width, if defined through CSS classes.
Call the `.setFlexible()` method of any modo element child, to let it extend horizontally, until the container is filled.

####Vertical layout
Same behavior as in horizontal layout, but all child elements will extend to 100% width and flexible children will stretch in their height.


-------------------

__Important information:__

The Flex Container tries to make assumptions about the browsers css flexbox support.
It tests if either the current spec, or the older, deprecated spec is available in the browser and applies
one of them.

A JavaScript fallback implementation of the CSS flexbox model is planned, but not implemented right now.
This breaks the Flexcontainer in older versions of Internet Explorer, that don't support any kind of css flexbox model.

demo:{
    "target": "en/flexcontainer/",
    "display": [
        "programmatic.js",
        "declarative.js",
        "style.css"
    ],
    "editable": true
}:demo

##Constructor
###modo.FlexContainer(params):modo.FlexContainer {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[direction]", "Use the pre-defined constants `modo.FlexContainer.HORIZONTAL` or `modo.FlexContainer.VERTICAL` to define the containers alignment.    \nDefault: `modo.FlexContainer.HORIZONTAL`"],|endimportmarker:constructor|
import:"reference>container.md>constructor":import
]]

##Properties
|importmarker:properties|
###modo.FlexContainer.HORIZONTAL:String {.property}
Use this property as a value for the `direction` parameter in the constructor, to achieve a
horizontal alignment of child elements.

###modo.FlexContainer.VERTICAL:String {.property}
Use this property as a value for the `direction` parameter in the constructor, to achieve a
vertical alignment of child elements.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods||endimportmarker:methods|
####Inherited Methods from [modo.Container](container)
import:"reference>container.md>methods":import

##Events
|importmarker:events||endimportmarker:events|

####Inherited Events from [modo.Container](container)
import:"reference>container.md>events":import

##CSS Classes
|importmarker:css|
###mdo-flexcontainer {.css}
Applied to the flex container element.

###mdo-flex-horizontal {.css}
Applied, when the flex container uses horizontal layout.

###mdo-flex-vertical {.css}
Applied, when the flex container uses vertical layout.

###mdo-flex-fallback {.css}
Applied, if the current browser does not support the latest flexbox css specs and the 2009 spec should be used.

###mdo-flex-js-fallback {.css}
Applied, if both css flexbox specs are not supported by the browser and JavaScript calculations are needed.

###mdo-flexible {.css}
Applied to any child element of the flex container that should stretch its dimensions.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Container](container)
import:"reference>container.md>css":import