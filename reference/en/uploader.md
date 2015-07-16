conf:{
    "root": "modo",
    "title": "modo.Uploader",
    "constructor": true,
    "file": "",
    "key": "ref:uploader"
}:conf

#modo.Uploader

This provides a file upload element where the user can pick one or multiple files from his harddrive to get them uploaded to a server.

Please note that you need to use serverside scripts to utilize this element. The modo.Uploader element will send
the file(s) in the POST field `file`.

File uploads can be processed by either the "classic" POST transfer (with an invisible iframe), or via AJAX, which
adds progress reporting to the process. The classic approach is more robust, but won't give
you any information about the uploads' progress.

demo:{
    "target": "en/uploader/",
    "display": [
        "programmatic.js",
        "declarative.js"
    ],
    "editable": true
}:demo

##Constructor
###modo.Uploader(params):modo.Uploader {.constructor}
The following list of parameters can be used in the params object, passed to the constructor.
_Parameters in [brackets] are optional._
[[
["Property", "Description"],
|importmarker:constructor|
["target", "URL where the file upload should be sent to"],
["[label]", "Label for the upload button. Defaults to `Upload`."],
["[mimeFilter]", "Will be passed to the incorporated `<input type=\"file\">` element to limit the mimetype of the pickable file(s)"],
["[autostart]", "Should the upload start immediately after a file has been chosen? Defaults to `false`"],
["[ajax]", "Set this to `true` to send the files via AJAX and not with the classic iframe approach. If the browser does not support AJAX file uploads, the setting will be ignored. Defaults to `false`"],
["[multiple]", "Allow the user to select multiple files to be uploaded. Defaults to `false`"],|endimportmarker:constructor|
import:"reference>element.md>constructor":import
]]

##Properties

####Inherited Properties from [modo.Element](element)
import:"reference>element.md>properties":import

##Methods
|importmarker:methods|
###clear(options):this {.method}
Call this to clear any selection a user has been made before. Pass `{silent: true}` as options parameter to avoid
triggering the `clear` event.
 
###getFiles():fileList {.method}
Returns a [list of files](https://developer.mozilla.org/de/docs/Web/API/FileList), the user has selected before.

###upload():this {.method}
Will manually trigger the upload of any selected files. Needs to be called, if `autostart` has not been
set to `true` in the constructor.

###setStatus(value):this {.method}
This will set the status label of the upload element to the given string. You can use this to display information
about the upload progress.

###setTarget(url):this {.method}
Overwrite the target URL where the files should be uploaded against.


###enable():this {.method}
Enables the button to capture clicks. Removes the CSS-Class `mdo-disabled` from its DOM element. Triggers the Backbone Event "enabled".

###disable():this {.method}
Disables the button to not capture any clicks. Adds the CSS-Class `mdo-disabled` to its DOM element. Triggers the Backbone Event "disabled".

####Inherited Methods from [modo.Element](element)
import:"reference>element.md>methods":import
|endimportmarker:methods|


##Events
|importmarker:events|
###change {.event}
Triggered, when the user has selected one or more files.

The first event parameter is a [list](https://developer.mozilla.org/de/docs/Web/API/FileList) of the selected files.


###clear {.event}
Triggered, when the users file selection has been cleared through the call of `clear()`.

###upload&#58;start {.event}
Triggered when the upload has begun.

###upload&#58;progress {.event}
Triggered whenever a progress has been made on the file upload. Only being triggered if the element
has been created passing `ajax = true` to the constructor.

The event parameter is an object containing information about the upload progress:

    {
        total: 123153453453 //total bytes
        loaded: 80849283423 //uploaded bytes until now
        percent: 65.6492214844 //calculated percentage of the file upload
    }

###upload&#58;finish {.event}
Triggered when the uploader is done sending the file(s) to the server.

The first event parameter is the response text, received from the server.

###upload&#58;error {.event}
Triggered when an error has occured while sending the files. Only being triggered if the element
has been created passing `ajax = true` to the constructor.

The first event parameter is the response text, received from the server.

###enabled {.event}
Triggered, when the button has been enabled through `enable()`.

###disabled {.event}
Triggered, when the button has been disabled through `disable()`.

####Inherited Events from [modo.Element](element)
import:"reference>element.md>events":import
|endimportmarker:events|


##CSS Classes
|importmarker:css|
###mdo-uploader {.css}
Applied on the element itself.

###mdo-uploader-button {.css}
Applied to the button element (additionally to the default `.mdo-button` class) the user can
click on to select a file.

###mdo-uploader-status {.css}
Applied to the status label next to the button that should display additional information during the upload.

###mdo-uploader-uploading {.css}
Applied to the element itself, while an upload is in progress.

###mdo-uploader-selected {.css}
Applied to the element itself, when a file selection currently exists.

###mdo-disabled {.css}
Applied when the element has been disabled through `disable()`. Will be removed after
a call to `enable()`.

|endimportmarker:css|
####Inherited CSS Classes from [modo.Element](element)
import:"reference>element.md>css":import