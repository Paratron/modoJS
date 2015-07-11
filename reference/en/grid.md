conf:{
    "root": "modo",
    "title": "modo.Grid",
    "constructor": true,
    "file": "",
    "key": "ref:grid"
}:conf

#modo.Grid

Use this element to present information in a tabular structure.
Unlike the modo.List element, data is separated into single columns in the grid element.
You can specify renderers or presentor elements for every column separately.
The Modo Grid supports arrays and Backbone.Collection as datasources.

demo:{
    "target": "en/grid/",
    "display": [
        "data.js",
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Grid(params):modo.Grid {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["data", "Either a array of JavaScript objects, or a Backbone Collection."],
["columns", "Pass an array of objects here, specifying information about how each colum should be handled. _For Example:_

    [
        {
            key: 'some_key',            //The key to use from the datasource.
            title: 'The column header', //HTML possible
            render: function(d){
                //HTML, or a Modo Element is expected to be returned.
                //Will be wrapped into a additional DIV (the cell).
                return d.toString();
            },
            itemEvents: {
                'click': function(event, index, cellData, rowData, columnKey){
                    //Do something
                }
            },
            required: false             //Decide if this column can be
                                        //user-selected or must be shown.
        }
    ]"],
["[prepare]", "The prepare function is called before each row is being rendered.    \nYou can make up own columns out of data which is generated dynamically upon table creation.

    prepare: function(rowObject){
        rowObject.formattedTime = (new Date(d.time)).toLocaleString(); 
        return rowObject;
    }"],
["[visibleColumns]", "Array of keys of the columns that should be displayed. Default = null (all)"],
["[rowTag]", "The HTML tag where rows are rendered with. Default: DIV"],
["[cellTag]", "The HTML tag where cells are rendere width. Default: DIV"],
["[collector]", "A function, which filters the dataset of the list, before rendering. This is applied if the \"data\" parameter contains a Backbone Collection. The function gets the lists data collection as a parameter. The default collector function is:

    function(collection){
        return collection.filter(function(){return true;})
    }"],
["[updateOn]", "An array of event names - fired by a Backbone Collection - on which the list should be re-rendered. Default: `['add', 'change', 'remove', 'sort']`"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###update() {.method}
Re-Draws the table.

###setColumns(columnData):this {.method}
Set up new column data for the grid.

###set(data, [options]):this {.method}
Re-Setting the grid data. Pass a object `{silent:true}` to prevent a change event from being fired.

|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import

##Events
|importmarker:events|
###update {.event}
Triggered when the table has been re-drawn.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-grid {.css}
Applied to the modo element.

###mdo-grid-header {.css}
Applied to the header container, inside the element.

###mdo-grid-row {.css}
Applied to each row container inside the element.

###mdo-grid-cell {.css}
Applied to each cell container inside the element.

###mdo-grid-column-[KEY] {.css}
Applied to each column with its unique key.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import