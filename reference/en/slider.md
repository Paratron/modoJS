conf:{
    "root": "modo",
    "title": "modo.Slider",
    "constructor": true,
    "file": "",
    "key": "ref:slider"
}:conf

#modo.Slider

Slider elements can be used to pick a numeric value or a numeric range between a minimum and maximum value.

demo:{
    "target": "en/slider/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Slider(params):modo.Slider {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[direction]", "Sets the direction of the slider element. Can be either `horizontal`, or `vertical`. Default: `horizontal`"],
["[range]", "The slider element can either pick a single value, or a range. Default: `false`"],
["[minValue]", "The sliders minimum value. Default: `0`"],
["[maxValue]", "The sliders maximum value. Default: `100`"],
["[value1] or [value]", "The sliders initial set value. Use `value1` when you are creating a range slider. Default: `0`"],
["[value2]", "The second value, when selecting a range. Default: `0`"],
["[step]", "Define here, which steps are used between values on the slider. For example `0.1`, `1` or `10`. Default: `1`"],
["[model]", "Set a Backbone Model here to bind the sliders value(s) to a Backbone.Model property (type should be numeric)."],
["[modelKey] or [modelKey1]", "This, or a value function is mandatory for using the `model` parameter. This is the string key of the models property to use for the _first_ slider value."],
["[modelKey2]", "This, or a value function is mandatory for using the `model` parameter. This is the string key of the models property to use for the _second_ slider value."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###value:Bool {.property}
Can be used to retrieve the current check status of the object.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###get():number/array {.methods}
Returns the numeric value the slider has been set to.
Will return an array with two numeric values if the element is a range slider.

###set(values):this {.methods}
Pass a numeric value to set the sliders value.
Pass an array with two numeric values to set the two values of a range slider.

###setMin(value):this {.methods}
Pass a numeric value to set the sliders minimal selectable value.

###setMax(value):this {.methods}
Pass a numeric value to set the sliders maximal selectable value.

###disable():this {.methods}
Will disable the element for user interactions.

###enable():this {.methods}
Re-enables the element for user interactions if it previously has been disabled.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered whenever the user interacts with the element to set a new value.

###disabled {.event}
Triggered, when the element has been disabled.

###enabled {.event}
Triggered, when the element has been enabled.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-slider {.css}
Applied directly to the slider element.

###mdo-slider-vertical {.css}
Applied to the slider element, when it should be rendered vertically instead of horizontally.

###mdo-slider-range {.css}
Applied to the slider element, when it should be a range slider.

###mdo-slider-value {.css}
Applied to the sliders value indicator.

###mdo-slider-plug1 {.css}
Applied to the sliders first moveable plug.

###mdo-slider-plug2 {.css}
Applied to the sliders second moveable plug (appears on range sliders).
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import