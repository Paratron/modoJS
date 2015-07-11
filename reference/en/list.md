conf:{
    "root": "modo",
    "title": "modo.List",
    "constructor": true,
    "file": "",
    "key": "ref:list"
}:conf

#modo.List

A modo List generates lists from data sets.
It can be either used by passing an array of objects as the data parameter, or a [Backbone Collection](http://backbonejs.org/#Collection).

modo.List elements are interactive. You can listen to events on the single list items and directly
work with the list items dataset in the event callback.

<style>
    .inlineDemo{
        height: 370px !important;
    }
</style>

demo:{
    "target": "en/list/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.List(params):modo.List {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["data", "Either a array of JavaScript objects, or a Backbone Collection."],

["[collector]", "A function, which filters the dataset of the list, before rendering. The function gets the lists data collection as the first parameter and a boolean true/false if its a Backbone Collection as second parameter. The default collector function is:\n\n    function(collection){ \n    \treturn _.filter(collection, function(){return true;})\n    }"],

["[updateOn]", "An array of event names - fired by a Backbone Collection - on which the list should be re-rendered. Default: `['add', 'change', 'remove', 'sort']`"],

["[itemRender]", "The render function for a single list item.
Gets passed the serialized JavaScript object as function argument.
In case of a Backbone Collection as data source, the according Backbone Model is added to the object as the property `_m`.
By default, the first property of the serialized object is rendered.
The default function is:

    function (d, elementIndex, objectKeys) {
        for (var key in d) {
            if(key === '_m') continue;
            break;
        }
        return '<div>' + d[key].toString() + '</div>'
    }

__Heads up!__
The attribute `elementIndex` contains the index of the currently rendered list element, starting with zero.
`objectKeys` is only available when the data source is an object and will then contain an array with all object keys as strings.

___Notice:___ All rendered child elements get the CSS-Class `mdo-list-item` added, after they have been rendered.

___Tip:___ You can pass a compiled underscore template to use it as item renderer!

___PRO Tip:___ You can return ONE modo.* element from the renderer method instead of a HTML string!"],

["[emptyRender]", "This function is called when the list has no items to display (dataset is empty)."],

["[itemEvents]", "Events for list items are attached the same way like [events can be bound to a Backbone View](http://backbonejs.org/#View). When you are using a Backbone Collection as data source, your event handler functions get passed the captured event as first parameter and the according Backbone Model from the collection as second parameter. You can either attach events directly to a list item, or to child-elements inside the list item (i.e. to attach edit/remove buttons). Example:\n\n    {\n    \t'click': function(e,i,m){\n    \t\talert('You have clicked on the item ' + m.get('title'));\n    \t},\n    \t'click .removebutton': function(e,i,m){\n    \t\te.stopPropagation(); //Important! Or click will be fired too.\n    \t\tif(confirm('Should ' + m.get('title') + ' be deleted?')){\n    \t\t\tm.destroy();\n    \t\t}\n    \t}\n    }"],
import:"reference>element.md>constructor":import|endimportmarker:constructor|
]]

##Properties
|importmarker:properties||endimportmarker:properties|
###length:Number {.property}
Provides access to the number of elements being rendered by the list.

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###get([limit]):Array {.method}
This returns the lists filtered dataset in the same format as [Backbones toJSON()](http://backbonejs.org/#Collection-toJSON) method.
[[
	["Function parameter", "Description"],
	["[limit]", "Optional parameter to limit the amount of returned entries to the given number."]
]]
__Note:__ This returns the dataset, the list itself works with, so in case a Backbone Collection is used as data source, the `collector` function defined in the constructor will be applied, first.


###getFocusedIndex():Number {.method}
Returns the index of the currently focused item, if any.

###getItemByKey(key):jQuery {.method}
Returns the jQuery-enhanced DOM element for a specific data key (array index, or Backbone.Collection id).

###set(dataset, [options]):this {.method}
Replaces the current dataset of the element and triggers a update.
[[
    ["Function parameter", "Description"],
    ["dataset", "The new dataset to be used. Can be an array, or a Backbone.Collection"],
    ["options", "An options object. `{silent: true}` can be used to prevent events to be triggered."]
]]

###update([options]):this {.method}
This causes the lists HTML to be re-generated. Will be automatically called when a Backbone Collection is used as a data source and it emits one of the events, registered by passing `updateOn` to the constructor.
This will trigger the Backbone Event "update".

###focus():this {.method}
Sets the keyboard focus to the element. This means the user can select items from the list with his arrow keys.
This needs the [modo.keyListener](keyListener) to be loaded and will enable it. The list will put the keyListener
in a scoped state to exclusively consume the key press events of the cursor buttons.

###blur():this {.method}
Removes the keyboard focus from the element and also removes the scope from the keyListener.

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import
|endimportmarker:methods|

##Events
|importmarker:events|
###update {.event}
Will be triggered when the `update()` function has been called (automatically, or manually).

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import
|endimportmarker:events|

##CSS Classes
|importmarker:css|
###mdo-list {.css}
Applied on the list element itself.

###mdo-list-item {.css}
Applied to every single list-item element. This class is also automatically applied on list elements, generated by the `itemRender` function, defined in the element constructor.

###mdo-list-empty-element {.css}
Applied on the element that is displayed when no elements are found in the data source.
This element is only visible when generated from the `emptyRender` function, defined in the elements constructor.

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import
|endimportmarker:css|