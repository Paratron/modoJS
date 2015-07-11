conf:{
    "root": "modo",
    "title": "modo.keyListener",
    "constructor": false,
    "file": "",
    "key": "ref:keylistener"
}:conf

#modo.keyListener

The keyListener object is no creatable element, but attaches itself to the modo core.
Once enabled with `modo.keyListener.enable()`, it observes any keystroke made and emits
events according to it.

Its possible to submit a scope to the keyListener, to make it possible to forward
key events to only a single element temporarily.

__Heads up:__ This is not a element constructor!


###About event scopes
With event scopes, we introduced a pattern that is not used in BackboneJS.
We added the scopes to the keyListener element, because it may be necessary to override
captured keys in different states of your application.

__Example:__
You listen for multiple global hotkeys or keystrokes inside your application.
When a certain dialog is displayed, you want to mute the global hotkeys for the time the dialog is open.

Doing this with event scopes is easy: just set the scope when opening the dialog and all global
key-events won't be triggered anymore.
Release the scope after the dialog has been closed and all keystrokes are available again.

##Properties
|importmarker:properties|
###keymap:Object {.property}
The keymap object stores the relations between key names in human language and and javascript keycodes.
The keymap object contains keymaps for different languages, since keyboard layouts differ from country to country.
The keymap is picked through `navigator.language`.

###lastKey:String {.property}
Contains the last pressed key.

###isScoped:Boolean {.property}
Contains information about if the keyListener currently runs in scoped mode or not.

|endimportmarker:properties|

##Methods
|importmarker:methods|
###enable() {.method}
Enables the keyListener. It won't listen for, or capture keyboard events before this method is called.
Calling it multiple times has no effect. So you may call it from every application module that needs the keyListener.

###disable() {.method}
This method disables the keyListener. No more keyboard events will be triggered until `enable()` is called again.

###isPressed(key) {.method}
Returns `true`, when the given key is currently pressed.
`key` can either be the keys name, or its index.

###setScope(scope) {.method}
Will shift the current event scope to the submitted namespace.
Can be called multiple times - if a later scope is being released, the scope switches back to the
previous state until no more scopes are active.

[[
    ["Function parameter", "Description"],
    ["scope", "Either of type `modo.*` or `String`"]
]]

###releaseScope(scope) {.method}
Removes a scope from the scopes list.
If it was the last submitted scope, the scope pointer will switch back to the previously submitted scope.

[[
    ["Function parameter", "Description"],
    ["scope", "Either of type `modo.*` or `String`"]
]]

###onScoped(scope, eventName, callback, [context]) {.method}
Wrapper method for the "on" method, to bind to scoped events.
Read more about [Backbone.Events.on()](http://backbonejs.org/#Events-on)

[[
    ["Function parameter", "Description"],
    ["scope", "Either of type `modo.*` or `String`"],
    ["eventName", "A string, specifying the event to listen to"],
    ["callback", "The function to call when the event is triggered"],
    ["context", "Optional context for the callback function"]
]]

###offScoped(scope, eventName, callback, context) {.method}
Wrapper method for the "off" method, to unbind scoped events.
Read more about [Backbone.Events.off()](http://backbonejs.org/#Events-off)
|endimportmarker:methods|

##Events
|importmarker:events|
###stroke {.event}
Will be triggered when a key-stroke (combination of keys) has been pressed.
[[
    ["Event Parameter", "Description"],
    ["keyboardEvent", "The original keyboard event object"],
    ["strokeName", "A string representation of the pressed keystroke"]
]]
The stroke name is created like this:

    [ctrl+][shift[+]][alt]+keyName

So for example: `ctrl+u` or `alt+f` or even `ctrl+shift+z`.


###[keyname] {.event}
You can listen to specific keys directly, like so:

    modo.keyListener.on('u', function(e){});

The event will be triggered, when the specified key has been pressed.

__Special key names are:__
backspace, tab, enter, shift, ctrl, alt, pause, capslock, escape, space, pageup, pagedown,
end, home, left, up, right, down, insert, delete, f1-f12, numlock, scrolllock

[[
    ["Event Parameter", "Description"],
    ["keyboardEvent", "The original keyboard event object"],
    ["keyName", "The name of the pressed key as string"]
]]

###keyPress {.event}
This event is triggered on _every_ key press. The name of the pressed key is submitted as an event attribute.

[[
    ["Event Parameter", "Description"],
    ["keyboardEvent", "The original keyboard event object"],
    ["keyName", "The name of the pressed key as string"]
]]
|endimportmarker:events|