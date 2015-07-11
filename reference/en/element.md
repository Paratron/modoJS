conf:{
    "root": "modo",
    "title": "modo.Element",
    "constructor": true,
    "file": "",
    "key": "ref:element"
}:conf

#modo.Element

This is the most basic element type of all Modo elements. It brings barely no features, but any other kind of Modo element is based upon it.

All Modo elements are created in the same way:

    var modo_element = new modo.Element(params);

A modo.Element object is by default extended with [Backbone.Events](http://backbonejs.org/#Events).

##Constructor
###modo.Element(params):modo.Element {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[className]", "A string with custom CSS classes to apply to the generated DOM element"],
["[dataAttributes]", "A object with attributes to assign to the generated DOM element. Omit the \"data-\" part. So for example `{count: 1}` becomes `data-count=\"1\"` on the DOM element."],
["[el]", "The jQuery enhanced DOM element to be generated. If nothing is set, a standard DIV container will be created. If you want to use a different DOM element, pass a jQuery generated DOM element to this parameter."],
["[showEffect]", "The default show effect for the element. See associated property description. Default: `null`"],
["[hideEffect]", "The default hide effect for the element. See associated property description. Default: `null`"]
|endimportmarker:constructor|
]]

##Properties
|importmarker:properties|
###el:Object {.property}
Contains the jQuery enhanced DOM Node of this modoJS element.

###modoId:Number {.property}
Contains a internally given, numeric ID for this element.

###visible:Bool {.property}
Will be set by `.show()` and `.hide()`. Access this property to check the current visibility of the element.

###showEffect:object {.property}
Set a default show effect (like the options you can pass to the `show()` / `hide()` methods.

Example:

    element.showEffect = {
        effect: 'slideDown',
        effectArgs: ['fast']
    };
    
###hideEffect:object {.property}
Define a default hide effect instead of a simple, instant hide.

|endimportmarker:properties|


##Methods
|importmarker:methods|
###setFlexible([value]):this {.method}
Pass either true or false to this value to make the element stretch inside a [modo.FlexContainer](flexcontainer) element.

###show(options):this {.method}
Make the connected DOM object visible and trigger the Backbone Event "show".

You can control the way the element is shown by passing an object of options.

Example:

    element.show({
        effect: 'slideDown',
        effectArgs: ['fast']
    });

###hide():this {.method}
Make the connected DOM object invisible and trigger the Backbone Event "hide".

You can control the hide effect the same way as with the `show()` method.

###addClass(classname, doPrefix):this {.method}
Will add another class name to the DOM element. The class name will be automatically prefixed (i.e. with mdo-) if `doPrefix = true` (default).

###removeClass(classname, doPrefix):this {.method}
Will remove a class name from the DOM element. The class name will be automatically prefixed.

###addClassTemporary(classname, timeout, doPrefix):this {.method}
Helps with adding a classname temporarily to the object. Just call this method and after the specified
amount of time, the added class(es) will be removed.

---------------------

__Note:__ All modoJS Objects are extended with all methods of the [Backbone.Events](http://backbonejs.org/#Events) class.

---------------------
|endimportmarker:methods|

##Events
|importmarker:events|
###show {.event}
Triggered, when the object has been displayed through `show()`

###hide {.event}
Triggered, when the object has been hidden through `hide()`
|endimportmarker:events|

##CSS Classes
|importmarker:css|
###mdo-element {.css}
Basic class that will be applied to every element that extends [`modo.Element`](element).

###mdo-flexible {.css}
Will be applied to every modo element where `setFlexible(true)` has been called upon.
|endimportmarker:css|