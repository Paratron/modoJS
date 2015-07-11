conf:{
    "root": "modo",
    "title": "modo.Toolbar",
    "constructor": true,
    "file": "",
    "key": "ref:toolbar"
}:conf

#modo.Toolbar

The modo toolbar can be used to create the classic application toolbars with groups of buttons to select tools from, or trigger certain actions.

The toolbar is treated as ONE modo element and has no real, accessable children. You can add and remove buttons via their given keys, but won't get
a normal modo.Element interface for the unique buttons.

When a button is clicked, a event with the buttons key is fired on the toolbar element.

Buttons can be stacked into containers for visual separation.
Its also possible to group buttons together logically, do get a radiobutton-like behaviour (for example to select a tool from a group of tools).

demo:{
    "target": "en/toolbar/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Toolbar(params):modo.Toolbar {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[elements]", "This attribute is used to set up the structure of the toolbar.
You can create single buttons or directly stack them into groups.

Example:

    elements: [
        {
            key: 'newDocument',
            disabled: true,
            className: 'newDocument',
            tooltip: 'Click to create a new Document',
            label: 'New Document'
        },
        [
            {
                key: 'tool1',
                label: 'Tool 1',
                group: 'tools'
            },
            {
                key: 'tool2',
                label: 'Tool 2',
                group: 'tools'
            }
        ]
    ]

Any property, except of `key` can be omitted.
Notice that the two 'Tool' buttons are grouped together by stacking them into an array.

You cannot nest button groups."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###add(obj):this {.method}
Adds a new button to the toolbar root.
Pass an object like this:

    {
        key: 'newDocument',
        disabled: true,
        className: 'newDocument',
        tooltip: 'Click to create a new Document',
        label: 'New Document',
        group: 'groupKey',
        data: {
            some: 'data'
        }
    }

Any property, except `key` can be omitted.

To add a container, just pass an array to the function. The container may contain button objects.

###addToContainer(containerIndex, obj):this {.method}
Works equally to `add()`, but adds the button to the container with the given index.


###remove(key):this {.method}
Removes the button with the given key, no matter in which container it is stored.
Will throw an exception if no element with the given key is found.

###removeContainer(index):this {.method}
Removes the container with the given container index.
Will throw an exception, if no container is found at that index.
_Notice:_ Buttons on the root level don't count to the index.

###getElementByKey(key):$ {.method}
Returns the jQuery enhanced DOM element of the button with the given key.

###enableButton(key):this {.method}
Enables a toolbar button for user interaction.

###disableButton(key):this {.method}
Disables a toolbar button for user interaction.

###enableGroup(name):this {.method}
Enables all buttons of the given logical group.

###disableGroup(name):this {.method}
Disables all buttons of the given logical group.

###enableContainer(index):this {.method}
Enables all buttons inside the container with the given index.

###disableContainer(index):this {.method}
Disables all buttons inside the container with the given index.

###toggleButton(key):this {.method}
If the button with the given key is in a button group, it will be toggled.
A previously toggled button from that group will be untoggled.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###click {.event}
Will be fired on each click on ANY button.
The listener function will get the click event as first attribute and the button key as second attribute.

###click:[key] {.event}
This is fired when a click on a certain button happens.

###toggle:[key] {.event}
Fired, when a toggle-able (grouped) button has been toggled.

###untoggle:[key] {.event}
Fired, when a toggle-able (grouped) button that has been toggled
has now become untoggled, because another button from that group
has been toggled.

###grouptoggle:[groupName] {.event}
Fired, when any toggle action has happened in the given group.
The listener function gets the key of the toggled button as first attribute,
the key of the previously toggled button as second attribute.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-toolbar {.css}
Applied on the element itself.

###mdo-toolbar-container {.css}
Applied on any container element that keeps buttons.

###mdo-toolbar-container-empty {.css}
Applied on a container that doesn't contain any buttons.

###mdo-toolbar-item {.css}
Applied on any toolbar button.

###mdo-toolbar-item-[key] {.css}
Applied to any toolbar button, to style them uniquely.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import