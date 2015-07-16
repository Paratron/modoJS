conf:{
    "root": "modo",
    "title": "modo.popBox",
    "constructor": false,
    "file": "",
    "key": "ref:popbox"
}:conf

#modo.popBox

The popBox is a replacement or alternative to the browser's native alert(), confirm() and prompt() methods. 

The popBox replicates those, but also makes them fully styleable through CSS, translateable and even makes
them asynchronous by using [jQuery promises](http://api.jquery.com/Types/#Promise).

All popups will be opened as modal dialogs, blocking access to the underlying UI until the user has dismissed
the popBox in some way. Closing the boxes with hitting ESC or clicking the backdrop is also not possible.

demo:{
    "target": "en/popbox/",
    "display": [
        "declarative.js"
    ],
    "editable": true
}:demo

##Properties
|importmarker:properties|
###ALERT_TITLE:String {.property}
Default title for an alert box. Defaults to `Heads up!`.

###CONFIRM_TITLE:String {.property}
Default title for a confirm box. Defaults to `Are you sure?`.

###PROMPT_TITLE:String {.property}
Default title for a prompt box. Defaults to `Heads up!`.

###CONFIRM_BUTTON:String {.property}
Default text for a confirm button across all box types. Defaults to `Okay`.

###CANCEL_BUTTON:String {.property}
Default text for the cancel button (in prompt and confirm box). Defaults to `Cancel`.
|endimportmarker:properties|

####Inherited Properties from [modo.PopUp](element)
import:"reference>popup.md>properties":import

##Methods
|importmarker:methods|
###alert(params):jQueryPromise {.method}
Opens an alert-style popup. A shorthand method is `modo.alert()`. Pass a string as parameter to display that string inside the popup
while using the default title and button label.

If you want to, you can also set the button label and popup title, as well:

    modo.alert({
        title: 'Oh my!',
        message: 'This went horribly wrong!',
        btnConfirm: 'Nevermind'
    });
    
    
###confirm(params):jQueryPromise {.method}
A confirm box lets the user take a yes/no decision. A shorthand method is `modo.confirm()`. The returned promise will be either rejected or resolved
based on that decision. Again, pass a string as parameter to use the default title and default button labels
and only set the content message.

If you want to, you can also set the button labels and popup title, as well:

    modo.confirm({
        title: 'Empty trash?',
        message: 'Do you really want to clear out the trash bin?',
        btnConfirm: 'Yup, throw it away',
        btnCancel: 'Nope, leave it'
    });
    

###prompt(params):jQueryPromise {.method}
The prompt box will try to fetch an input from the user. A shorthand method is `modo.prompt()`. By default, the used input text is a default text but
any input type can be chosen for the prompt box. Pass only a string as parameter to set the body message of
the prompt and leave the default title and button labels.

These more complex options are available:

    modo.prompt({
        title: 'Confirm password',
        message: 'To perform this action, you need to re-enter your password.',
        type: 'password',
        btnConfirm: 'Confirm',
        btnCancel: 'Cancel'
    });

|endimportmarker:methods|