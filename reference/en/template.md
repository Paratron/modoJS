conf:{
    "root": "modo",
    "title": "modo.Template",
    "constructor": true,
    "file": "",
    "key": "ref:template"
}:conf

#modo.Template

The template element is a element that renders custom HTML parts of your interface, like static descriptions or decoration.
You can still hook up a Backbone.Model to the template element to replace certain placeholders in the template automatically.

##Constructor
###modo.Template(params):modo.Template {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["template", "A underscore template, or a string to be converted to a underscore template"],
["[data]", "A optional object, or Backbone Model to fill template placeholders from.    \nIf a Backbone Model is passed, the template will observe any changes on the model and update itself."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###set(data):this {.method}
Sets new template data. Can be either a generic javascript object, or a Backbone Model.
If a Backbone Model is passed, the element will listen to changes on the model and automatically update itself.
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###update {.event}
Will be triggered whenever the template gets update with fresh data.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-template {.css}
The template element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import