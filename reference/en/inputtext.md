conf:{
    "root": "modo",
    "title": "modo.InputText",
    "constructor": true,
    "file": "",
    "key": "ref:inputtext"
}:conf

#modo.InputText

The text input control can be used for different occasions.
Use the type parameter to tweak it to any kind of input you need (eg. search, mail, ...).

__Tip:__ it provides easy event-names for different keyboard events, like "keydown:enter".

demo:{
    "target": "en/inputtext/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.InputText(params):modo.InputText {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[type]", "Chose any kind of text input type from [the W3C specification](http://www.w3.org/TR/html-markup/input.html). Default = 'text'
You can also use `textarea` as input type which generates a `<textarea>` tag, instead of a `<input>` tag."],
["[placeholder]", "A placeholder text to be displayed when no user input was made."],
["[autogrow]", "Only available when you use the `textarea` type. This will make the textarea automatically grow and shrink depending of the amount of text in it. Default = `false`."],
["[changeThreshold]", "Amount of milliseconds to wait after the latest keydown before triggering the `change` event. Default: 500ms\n\nMakes it easier to avoid model updates and pushes to the server on EVERY key press of the user."],
["[value]", "A initial value to fill the element with, OR a function that returns a value. The function is called when you bind the element to a Backbone Model and want to generate the elements value from that model.

Example:

    value: function(model){
        return model.get('firstName') + ' ' + model.get('lastName');
    }

___Heads up:___ Two-way bindings are impossible if such a function is set.
"],
["[model]", "A Backbone Model object you want to bind the Element to."],
["[modelKey]", "The key of the Backbone Model to be observed on changes. This is only needed if you want to get a two-way binding of a specific property of a model. Omit this and specify a value function if you only want to feed model changes into the element."],
["[disabled]", "Disables the element right at construction time. (Handy for usage with modo.generate()"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###get():string {.method}
Returns the textfields current value.

###set(value):this {.method}
Sets the textfield to the given value. Will trigger the backbone event `change`.

###focus():this {.method}
Sets the user input cursor to the textinput. Will trigger the Backbone event `focus`.

###blur():this {.method}
Removes the user input cursor to the textinput. Will trigger the Backbone event `blur`.

###select([start], [length]):this {.method}
Select a part of the input texts value.
Can be called in different ways:

#####Param "start" and "length" omitted
Everything will be selected

#####Param "start" given, "length" omitted
Starts the selection `start` characters from the left - selects everything to the end.

#####Param `start` and `length` given
Selection starts `start` characters from the left with a length of `length` characters.

###disable():this {.method}
Disables the input text and blocks it from user input.

###enable():this {.method}
Enables the input text and accepts user input.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change(value) {.event}
The event is triggered, when the text-fields value is either changed by calling the `set()` function, or when a user has made an input. The event is fired when no keystrokes have been made for a specified amount of time.

###keydown(event) {.event}
The event is triggered, whenever a key is pressed by a user.
You can listen to only specific keys, by listening to `keydown:[keycode]`, or use a key alias, for example: `keydown:enter`.

Available aliases are: `enter, escape, alt, ctrl, shift, up, down, left, right, backspace, del, end, pos1, paste, tab`.

[[
	["Event parameter", "Description"],
	["event", "The javascript event object."]
]]

###focus {.event}
Triggered, when a user clicks into the textinput, or `focus()` has been called.

###blur {.event}
Triggered, when a user clicks away from the textinput, or `blur()` has been called.

###disable {.event}
Triggered, when the element got disabled.

###enable {.event}
Triggered, when the element got enabled.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-inputtext {.css}
Applied on the element.

###mdo-inputtext-[TYPE] {.css}
Depends on the type property passed to the elements constructor. So for example when using the type `textarea`,
the class name will be `mdo-inputtext-textarea`.

###mdo-placeholded {.css}
If the browser doesn't support the HTML5 placeholder attribute, the element will try to mimic it.
If the placeholder text is displayed, the `mdo-placeholded` class is applied as well, to enable you to style
the placeholded text.

|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import