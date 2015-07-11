conf:{
    "root": "modo",
    "title": "modo.Calendar",
    "constructor": true,
    "file": "",
    "key": "ref:calendar"
}:conf

#modo.Calendar

A simple calendar widget with the ability to let the user pick a specific day.

The calendar widget is made of two parts: The month selector on top, displaying two [modo.Button](button)s to navigate
forward and backwards in the months, as well as a label, which displays the currently
selected month/year, according to the defined `monthLabelFormat`.

The lower part of the widged shows a calendar-field, with multiple rows of days.
The first row contains localizable week-day names.

The calendar can be used to either just display a calendar, or even letting the user pick a date from it.

demo:{
    "target": "en/calendar/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

------------------

###Localization
The `modo.Calendar` object has a couple of properties you can change for localization reasons.
When you change this properties, the rendering of all `modo.Calendar` elements will be affected.

[[
    ["Property Name", "Description"],
    ["PREVIOUS", "Label of the 'Previous Month' button in the calendar month selector. Default: `<`"],
    ["NEXT", "Label of the 'Next Month' button in the calendar month selector. Default: `>`"],
    ["MONTH_NAMES", "Array with the full names of every month in the year.

Default:

    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

"],
    ["MONTH\_NAMES_SHORT", "Array with short Names of every month in the year.

Default:

    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

"],
    ["DAY_NAMES", "Array with the full names of all week days.

Default:

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

"],
    ["DAY\_NAMES_SHORT", "Array with short names of all week days.\n\nDefault:    \n`['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`"],
    ["SUFFIX", "Array with suffixes to be appended to certain numbers, when formatting dates.    \nIf you are using a language without suffixes, just provide an array with four empty strings.\n\nDefault:    \n`['st', 'nd', 'rd', 'th']`"]
]]

##Constructor
###modo.Calendar(params):modo.Calendar {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[minDate]", "A JavaScript Date object, defining the lowest date to select and navigate to."],
["[maxDate]", "A JavaScript Date object, defining the highest date to select and navigate to."],
["[monthLabelFormat]", "A string, defining the format of the month label of the calendar. Follows the rules of the [PHP date formatter](http://php.net/manual/en/function.date.php). Default format is: `F Y`, which becomes for example `January 2013`."],
["[date]", "A JavaScript Date object, which represents a pre-selected date on the calendar."],
["[selectable]", "Boolean definition if a user should be able to pick a date on the calendar, or just browse months. Default: true"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###enable():this {.method}
Enables the button to capture clicks. Removes the CSS-Class `mdo-disabled` from its DOM element. Triggers the Backbone Event "enabled".

###disable():this {.method}
Disables the button to not capture any clicks. Adds the CSS-Class `mdo-disabled` to its DOM element. Triggers the Backbone Event "disabled".
|endimportmarker:methods|

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import


##Events
|importmarker:events|
###click {.event}
Triggered, when the button is enabled and a user has clicked on it.
[[
	["Event parameter", "Description"],
	["event", "The click event object"]
]]


###enabled {.event}
Triggered, when the button has been enabled through `enable()`.

###disabled {.event}
Triggered, when the button has been disabled through `disable()`.

|endimportmarker:events|
####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import


##CSS Classes
|importmarker:css|
###mdo-button {.css}
Applied on the button element.

###mdo-disabled {.css}
Applied when the element has been disabled through `disable()`. Will be removed after
a call to `enable()`.

|endimportmarker:css|
####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import