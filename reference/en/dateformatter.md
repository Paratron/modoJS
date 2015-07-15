conf:{
    "root": "modo",
    "title": "modo.dateFormatter",
    "constructor": false,
    "file": "",
    "key": "ref:dateformatter"
}:conf

#modo.dateFormatter

The dateFormatter object is no creatable element, but attaches itself to the modo core.
It adds methods to the modo core to display times and dates in different formats. It can automatically
correct time offsets across different timezones as well.

The dateFormatter is fully internationalizable - just overwrite the object properties that
 contain the strings dates are constructed from to make dates appear in your locale flavor.

_Pro tip:_ Simply create an object (maybe in a JSON file) that contains your localized properties
and overwrite the original dateFormatter language properties by using underscores extend method: 

    _.extend(modo.dateFormatter, myLocalizedObj);

__Heads up:__ This is not a element constructor!

##Properties
|importmarker:properties|
###MONTH_NAMES:Array {.property}
Array of fully written month names. Defaults to:

    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 

###MONTH_NAMES_SHORT:Array {.property}
Array of short month names. Defaults to: 

    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

###DAY_NAMES:Array {.property}
Array of fully written day names. Defaults to:

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

###DAY_NAMES_SHORT:Array {.property}
Array of short day names. Defaults to:

    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

###SUFFIX:Array {.property}
A suffix string to be appended in some cases. Defaults to:

    ['st', 'nd', 'rd', 'th']
 
###TODAY:String {.property}
String that represents the word "today". Defaults to `today`.

###YESTERDAY:String {.property}
String that represents the word "yesterday". Defaults to `yesterday`.

###LAST:String {.property}
Micro-Template string for outputs of the `dateToFancyString()` method like "last week" or "last month". Defaults to `last %v`. `%v` is being replaced in that string.

###FUZZY_SECONDS:String {.property}
String that represents a very short timespan. May be returned by `dateToFancyString()`. Defaults to `about a minute ago`.

###NEVER:String {.property}
String that represents a time that has never been there. Usually expression for the unix time `0`.

###REL_UNITS:Array {.property}
Array of time units to be used by different methods. Defaults to:

    ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']

###REL_PAST:String {.property}
Micro-Template string for outputs of the `dateToFancyString()` method like "20 seconds ago". Defaults to `%v %u ago`. `%v` is being replaced by the value, `%u` is being replaced by the unit.

###REL_FUTURE:String {.property}
Micro-Template string for outputs of the `dateToFancyString()` method like "in 10 minutes". Defaults to `in %v %u`. `%v` is being replaced by the value, `%u` is being replaced by the unit.

###REL_CURRENT:String {.property}
String that represents the current moment in time. Defaults to `right now`.

###DEFAULT_FORMAT:String {.property}
String that represents the default output format for a full date, if `dateToFancyString()` notices a difference to now that is greater
than one week. Defaults to: `F jS, Y` (renders to: "April 5th, 2015").

###LOCAL_TIMEZONE:Integer {.property}
Automatically set timezone offset. This is the UTC offset in hours, the USER uses on his side.

###REMOTE_TIMEZONE:Integer {.property}
Automatically set timezone offset. This is the UTC offset in hours, the SERVER uses on his side. Defaults
to the same timezone as the user, so no corrections are made. Set this to the servers real timezone to 
make the library automatically correct all time output while `normalizeTimezones` is set to `true`.

###normalizeTimezones:Boolean {.property}
Should the library automatically correct time outputs from remote timezone to local timezone? Defaults to `true`.

|endimportmarker:properties|

##Methods
|importmarker:methods|
###convertTimezone(inDate, toOffset, fromOffset):Date {.method}
Takes a date or timestamp and converts it to another timezone.

###dateToFancyString(inDate, dateFormat, options):String {.method}
Takes a date object or timestamp and will return a "fancy" string representation which is most pleasant for users to read. Dates that
are more than 7 days away from the current time will be rendered as a "full" date using the `DEFAULT_FORMAT` property.

Example output:

- 10 minutes ago
- Today, 11:15
- Yesterday, 22:00
- Last tuesday

The following properties can be passed into the method in the `options` object to overwrite the classes default settings:

    {
        normalizeTimezone: true,
        localTimezone: -2,
        remoteTimezone: 2
    }
    
###dateToRelativeString(datePast, dateNow, options):String {.method}
This creates a "relative" string, as used often in applications and social networks.
Instead of printing out the precise datetime, it comparing the two dates and produces outputs like "x minutes ago".

Also works into the future.

Example output:

- 10 minutes ago
- In 2 weeks
- 3 years ago

The following properties can be passed into the method in the `options` object to overwrite the classes default settings:

    {
        normalizeTimezone: true,
        localTimezone: -2,
        remoteTimezone: 2
    }

###dateToString(format, inDate, options):String {.method}
This outputs a string with a formatted date and follows the [PHP date() specification](http://de2.php.net/manual/en/function.date.php).

The following properties can be passed into the method in the `options` object to overwrite the classes default settings:

    {
        normalizeTimezone: true,
        localTimezone: -2,
        remoteTimezone: 2
    }
|endimportmarker:methods|