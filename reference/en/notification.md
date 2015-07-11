conf:{
    "root": "modo",
    "title": "modo.Notification",
    "constructor": true,
    "file": "",
    "key": "ref:notification"
}:conf

#modo.Notification

Notification Elements are displayed inside [modo.NotificationContainer](notificationcontainer) elements.
They are used to inform your users about things that happened inside the application and are meant to replace basic alert() calls.

demo:{
    "target": "en/notification/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Notification(params):modo.Notification {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["content", "Any HTML content you want to display inside the notification element."],
["[duration]", "The amount of time in milliseconds, the notification should stay on screen after it has been displayed. If not defined, the default amount from the surrounding [modo.NotificationContainer](ref/notificationcontainer) is used. Default: `undefined`

___Tip:___ If you want to create sticky notifications, just set the duration to `0`."],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties
|importmarker:properties|
###displayTime:Number {.property}
Amount of time in milliseconds the notification should stay on screen. Will be set through the constructor.
|endimportmarker:properties|

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###set(html):this {.methods}
Replaces the notifications HTML content.

###hide():this {.methods}
Will make the surrounding [modo.NotificationContainer](notificationcontainer) remove the element from its stack.
|endimportmarker:methods|

##Events
|importmarker:events|
###show {.event}
Triggered when the notification became visible in the surrounding [modo.NotificationContainer](notificationcontainer).
___Notice:___ It can take some time until this is triggered, in case already more notifications are queued than the containers displayLimit allows to be shown.

###hide {.event}
Triggered when the notification has been hidden (and removed) from the surrounding [modo.NotificationContainer](notificationcontainer).
|endimportmarker:events|

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import

##CSS Classes
|importmarker:css|
###mdo-notification {.css}
Applied on the element.
|endimportmarker:css|

####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import