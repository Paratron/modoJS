conf:{
    "root": "modo",
    "title": "modo.FormContainer",
    "constructor": true,
    "file": "",
    "key": "ref:formcontainer"
}:conf

#modo.FormContainer

Use this container to create edit forms for your data.

You can add different editing controls to it (eg. Textfields, ToggleButtons, Dropdowns... basically everything with a `get()` and `set()` method) and assign each
control to a specific value of a object or Backbone Model.
When you pass a object or Backbone Model to the FormContainer, each value is provided to the connected element.
If autosave is enabled, all data from all elements is automatically assigned back to the original object/model structure upon changes.

You can also use the Modo FormContainer to collect and transfer data to your server by either a AJAX request, or a standard form submission.

demo:{
    "target": "en/formcontainer/",
    "notice": "This demo has only a declarative source, because it would be too complex, otherwise.",
    "display": [
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.FormContainer(params):modo.FormContainer {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[autosave]", "Set this to `true`, if you want to get automatic backward databinding between form elements and a Backbone Model. Optional. Default = false."],
["[autosync]", "Set this to `true`, if you want a connected BackboneJS Model to automatically send changes to the server."],
["[csrf]", "When you are working with [CSRF](https://www.owasp.org/index.php/CSRF) tokens (and you should!), you can pass the token here. When you do AJAX or form submission communication to your server, a value named `csrf_token` will be automatically sent along."],
["[prepare]", "Prepare functions are used to convert data from the data source to the specified element. Example:\n\n    function(dataValue){\n      return convertedValue;\n    }\n\nPass an key/value object here, where the keys match the keys of the Backbone Model or JavaScript Object you want to change and the values contain converter functions."],
["[clean]", "Clean Functions are used to convert data from the specified element to the data source. Example:\n\n    function(elementValue){\n      return convertedValue;\n    }\n\n__Note:__ If the function returns undefined, then nothing will be assigned to the data source (original will be kept)."],
["[finalPrepare]", "This function is called, AFTER all prepare functions for the specified elements have been run.    \nThe complete prepared dataset can be manipulated and extended before its finally distributed to the single elements.    \nMay be necessary to feed multiple multiple control elements from one data value."],
["[finalClean]", "This function is called, AFTER all clean functions for the data source have been run.    \nThe complete prepared data set can be manipulated, before its copied to the originally passed object / Backbone Model.    \n May be necessary to set one data value from multiple control elements, or remove temporary data fields."],
["[defaultData]", "The blank data object will be used as form data when the set() function is called with no data.    \nUseful for setting default values for new data objects."],
import:"reference>container.md>constructor":import|importmarker:constructor|
]]

##Properties
|importmarker:properties|
###dirty:Bool {.property}
This flag will be set to true when one of the contained, keyed set/get enabled elements fire a change event.
It will be set back to false, after a set() or save() call.
___Note:___ This will never switch to false in a autosave enabled FormContainer!

###defaultData:Object {.property}
The blank data object will be used as form data when the set() function is called with no data.
Useful for setting default values for new data objects.

####Inherited Properties from [modo.Container](container)
import:"reference>container.md>properties":import
|endimportmarker:properties|

##Methods
|importmarker:methods|
###add(...):this {.method}
Use this function to add one or more modo / jQuery / DOM elements to the container. Will trigger the Backbone Event "add".
Either pass:

- Modo elements directly
- DOM/jQuery elements directly
- Modo elements encapsulated in a object to add them with keys. Example: `{mykey: someModoElement}`

###remove(key, [force=false]):this {.method}
This will remove the element with the given key from the container.

You cannot remove elements nested inside a [modo.FormSlot](formslot) container by default.
Pass `force = true` to remove the parent FormSlot container of the given element as well. Be careful, this
might remove other elements with different keys that are also stored in that FormSlot!

###removeAll():this {.method}
Will remove all elements from that FormContainer.

###set(data):this {.method}
Will pass a new dataset into the container and will populate all children with a set() function and a given key  with its matching data.
When you omit the `data` property, the form will be reset to the `defaultData` you have pre-defined.

###reset([options]):this {.method}
Same as calling `set()` without a parameter, but may be easier to remember.

###get():object {.method}
Will return a getJSON()-like formatted object with all current values from all elements with a get() method and a populated key.

###getElements():array {.method}
Returns an array of all added elements.

###save():this {.method}
Writes all changed data back to the given dataset.

###send(options):this {.method}
This method can be used to transport your collected data via HTTP. Submit the parameter `ajax = true` to have it sent with an AJAX
request (and the result returned in a callback), or set `ajax = false` to submit the data like a traditional `<form>`-tag (triggers page load).

#####Available Options
[[
  ["Parameter", "Description"],
    ["target", "The URL which should receive the data."],
    ["[method]", "HTTP method to be used. default = POST"],
    ["[ajax]", "Should the data be sent through a AJAX call, or with traditional form submission? default = true"],
    ["[callback]", "A function to be called after the data has been sent. Will receive an argument with the response string."]
]]

###focus():this {.method}
Will try and set the input focus to the first element.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>container.md>methods":import

##Events
|importmarker:events|
###change {.event}
Triggered, wenn the forms dataset has been changed through a call to `set()`.

###save {.event}
Triggered after the `save()` method has been called.
|endimportmarker:events|

####Inherited Events from [modo.Container](container)
import:"reference>container.md>events":import

##CSS Classes
|importmarker:css|
###mdo-formcontainer {.css}
Will be added to this element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Container](container)
import:"reference>container.md>css":import