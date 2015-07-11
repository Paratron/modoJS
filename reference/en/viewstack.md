conf:{
    "root": "modo",
    "title": "modo.Viewstack",
    "constructor": true,
    "file": "",
    "key": "ref:viewstack"
}:conf

#modo.Viewstack

The view stack is a container type that only shows one child at a time and automatically hides all other children.

__Tip:__ Connect the ViewStack with a ToggleGroup to create tabbed content areas!

demo:{
    "target": "en/viewstack/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Viewstack(params):modo.Viewstack {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["switchMethod", "A function that should handle the switching between the element children. By default, the element uses `show()` and `hide()` for switching items. Default: `undefined`.
 
Example for fading between elements:
 
     var vst_myStack = new modo.ViewStack({
        switchMethod: function(hideElm, showElm){
            hideElm.el.fadeOut('fast', function(){
                showElm.el.fadeIn('fast');
            });
        }
     });
"],|endimportmarker:constructor|
import:"reference>container.md>constructor":import
]]

##Properties
|importmarker:properties|
###switchMethod:Function {.property}
See object constructor. Optional function, being called for switching between elements.
 
###count:Number {.property}
Number of elements inside the viewstack.

###displaying:Number {.property}
Index of the currently visible element.
 
|endimportmarker:properties|

####Inherited Properties from [modo.Container](container)
import:"reference>container.md>properties":import

##Methods
|importmarker:methods|
###add(object, options):this {.method}
The behaviour of this add() function is different to the behaviour of the Container's add() function.
You have to add a key/value object here, where the value is a modo element.

Example:

    {
       'test': new modo.Container()
    }

So you can show this element by calling display('test');    
__Notice:__ You can add multiple elements at once. Just give every element its own object key.

This method triggers the `add` event. Pass `{silent: true}` as options object to avoid the event.

###remove(key, options):this {.method}
Will remove the element with the given key from the container.
 
A error will be thrown if the element is not part of the container.

This method triggers the `remove` event. Pass `{silent: true}` as options object to avoid the event.

###getElements():object {.method}
Returns the internal object with references to all contained elements.

###getElementByKey(key):object {.method}
Returns a reference to the object with the given key. Will throw an error if the element doesn't exist.

###set(key):this {.method}
Switches the displayed child to the one with the given key. Will throw an error if no element with this
key exists.

Triggers a `display` event.

__Tip:__ Define a `switchMethod` to create custom show/hide effects.

###get():boolean {.method}
Returns the key of the currently visible child.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change(key) {.event}
Triggered, when the visible child of the container has been changed. Gets the key of the now visible child passed.

###add(object) {.event}
Triggered, when a new element has been added to the container. Gets a reference to the object passed.

###remove(object) {.event}
Triggered, when a element has been removed from the container. Gets a reference to the object passed.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-viewstack {.css}
Applied on the element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import