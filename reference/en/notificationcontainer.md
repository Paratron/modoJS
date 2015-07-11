conf:{
    "root": "modo",
    "title": "modo.NotificationContainer",
    "constructor": true,
    "file": "",
    "key": "ref:notificationcontainer"
}:conf

#modo.NotificationContainer

The [modo.Notification](notification) element provides a better alternative to alert() messages to notify your user about something.
They are placed in front of everything and will stack up from one corner of your application into a specific direction, just like [GROWL messages](http://growl.info/).

The modo.NotificationContainer is used to collect groups of notification elements. The container places itself on top of everything and gives the order of notifications a direction.

___Heads up!___
This element attaches itself automatically to the application root container upon creation. It does NOT need to be attached to a container manually.

demo:{
    "target": "en/notification/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.NotificationContainer(params):modo.NotificationContainer {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["[position]", "The position of the notification container, seen absolutely inside your app. Default: `top-right`.

Possible values are:
`top-right`, `top-left`, `bottom-right`, `bottom-left`"],

["[append]", "Defines where the next notification should be placed in the stack. Default: `after`

Possible values are:
`before`, `after`"],

["[showLimit]", "Defines the maximum number of notifications to be displayed in the box. All notification that are added above this limit are kept invisible until space gets free. Default: infinite"],

["[displayTime]", "Defines the default display time in milliseconds of a notification after that its being removed from the container. Default: `5000`"],

["[showEffect]", "A function that is called upon each notification to be displayed on screen.
The DOM element of the notification object is passed into the function.

Default:

    function (elm){
        elm.slideDown();
    }

"],

["[hideEffect]", "A function that is called upon each notification to be hidden from screen.
The DOM element of the notifications object is passed into the function, as well as a callback function to be called after the animation is complete.

Default:

    function (elm){
        elm.slideUp();
    }

"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties||endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###add(modo.Notification):this {.method}
Adds a new notification element to the container.

###createNotification(params):modo.Notification {.method}
This is a shortcut method to create a new [modo.Notification](notification) object and directly add it to the container.
The object is then returned from the method so you can keep a reference somewhere.
|endimportmarker:methods|

##Events
|importmarker:events|
###add {.event}
Triggered, whenever a new notification has been added through `add()` or `createNotification()`.

###remove {.event}
Triggered, whenever a notification has been removed from the Notification Container.
This happens when they either have expired, or defined to be invisible.

###queueEmpty {.event}
Triggered, when all notifications have been removed from the container.
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-notificationcontainer {.css}
Applied on element.

###mdo-pos-[top-left, top-right, bottom-left, bottom-right] {.css}
Applied dependend on the given `position` parameter in the constructor.

###mdo-append-[before, after] {.css}
Applied dependent on the given `append` parameter in the constructor.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import