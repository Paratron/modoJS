conf:{
    "root": "modo",
    "title": "modo.DropDown",
    "constructor": true,
    "file": "",
    "key": "ref:dropdown"
}:conf

#modo.DropDown

The modo dropdown enables the user to select an item from an Array or a Backbone Collection.

It utilizes a [modo.List](list) to render the dropdown list.

demo:{
    "target": "en/dropdown/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.DropDown(params):modo.DropDown {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["data", "Either a array of JavaScript objects, or a Backbone Collection."],
["[buttonRender]", "A function, used to render the selected item inside the dropdown button.    \nWorks the same way, as the `itemRender` function."],
["[selectedItem]", "This will set the dropdown to a specific item from the dataset.\n If you passed a array as data, pass an array index as item. \n If you passed a Backbone Collection as data, pass a data id or cid."],
["[placeholder]", "A placeholder to be displayed, when the dropdown is initialized without pre-selecting an item."],

["[collector]", "A function, which filters the dataset of the list, before rendering. This is applied if the \"data\" parameter contains a Backbone Collection. The function gets the lists data collection as a parameter. The default collector function is:\n\n    function(collection){ \n    \treturn collection.filter(function(){return true;})\n    }"],
["[updateOn]", "An array of event names - fired by a Backbone Collection - on which the list should be re-rendered. Default: `['add', 'change', 'remove', 'sort']`"],
["[itemRender]", "The render function for a single list item. Gets passed the serialized JavaScript object as function argument. In case of a Backbone Collection as data source, the according Backbone Model is added to the object as the property `_m`. By default, the first property of the serialized object is rendered. The default function is: \n\n    function (d, elementIndex, objectKeys) {\n    \tfor (var key in d) {\n    \t\tif(key === '_m') continue;\n    \t\tbreak;\n    \t}\n    \treturn '&gt;div>' + d[key].toString() + '&gt;/div>'\n    }\n__Heads up!__    \n The attribute `elementIndex` contains the index of the currently rendered list element, starting with zero.\n`objectKeys` is only available when the data source is an object and will then contain an array with all object keys as strings.\n\n ___Notice:___ All rendered child elements get the CSS-Class `modo-list-item` added, after they have been rendered.\n\n___Tip:___ You can pass a compiled underscore template to use it as item renderer!"],
["[itemEvents]", "Events for list items are attached, the same way like [events can be bound to a Backbone View](http://backbonejs.org/#View). When you are using a Backbone Collection as data source, your event handler functions get passed the captured event as first parameter and the according Backbone Model from the collection as second parameter. You can either attach events directly to a list item, or to child-elements inside the list item (i.e. to attach edit/remove buttons). Example:\n\n    {\n    \t'click': function(e,m){\n    \t\talert('You have clicked on the item ' + m.get('title'));\n    \t},\n    \t'click .removebutton': function(e,i,m){\n    \t\te.stopPropagation(); //Important! Or click will be fired too.\n    \t\tif(confirm('Should ' + m.get('title') + ' be deleted?')){\n    \t\t\tm.destroy();\n    \t\t}\n    \t}\n    }"],|endimportmarker:constructor|
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
###set(item, [options]):this {.method}
Will set the DropDown to a specific item from the dataset.    
If you passed an array as dataset, pass an array index as item attribute.    
If you passed an object as dataset, pass the key as item attribute.    
If you passed a Backbone Collection as dataset, pass a model id, or cid.

If the desired element is not found in the dataset, an error will be thrown.

As usual, pass `{silent: true}` to suppress any change events.

###setDataset(dataset, [options]):this {.method}
If you need to update or change the dataset of the DropDown element, use this method.
The method tries to re-select the previously selected element, so you may want to call
`myDropDown.set(null)` before setting a new dataset that contains different elements.

###get():mixed {.method}
Will return the index/key/id of the currently selected element.

###getData():mixed {.method}
Will return the data value of the currently selected element. This cann be a string/integer/Backbone.Model or
whatever items your dataset contains.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered, when a new element has either been chosen manually, or through `set()`.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-dropdown {.css}
Applied to the modo element.

###mdo-dropdown-button {.css}
Applied to the button that toggles the dropdown list.
 
###mdo-dropdown-list {.css}
Applied to the list element.

###mdo-dropdown-dropped {.css}
Applied to the modo element when the dropdown button has been pressed and the list should be visible.

###mdo-dropdown-selected {.css}
Applied to the currently selected element in the dropdown list. Mainly used for keyboard navigation.

|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import