conf:{
    "root": "modo",
    "title": "modoJS core",
    "constructor": false,
    "file": "",
    "key": "ref:modoCore"
}:conf

#modoJS Core

The modoJS core object exposes only a few methods and parameters. The most features are encapsulated in the numerous modoJS element constructors you can use at any place inside your application.

Despite of that, the core object provides a couple of very useful features.

##Object Properties

###VERSION:string {.property}
Contains the current version of the modoJS library. Should currently be `0.14`.

###cssPrefix:string {.property}
Contains the string prefix for any modoJS css classname that is applied to a element by the library. Defaults to `mdo-`.

If you want to use a different class prefix, change this property BEFORE creating any modo elements.



##Object Methods

###init([domTarget], rootElement):this {.method}
This initializes your modoJS application. It places a single root element at the desired DOM node where the root of the application should be.

If you omit the DOM target, modoJS will pick the `body` tag as application root. You don't have to use this function - it only makes it easier to set the cornerstone of an application.


[[
    ["Parameter", "Type", "Description"],
    ["[domTarget]", "DOM-Element", "Any DOM-Element of the current document, or a selector string. Optional. If omitted, the BODY element will be used."],
    ["rootElement", "modo.*", "Any kind of modoJS element. This is usually a [modo.Container](ref/container) or [modo.FlexContainer](ref/flexcontainer) which is used as the base of your application."]
]]

###defineElement(elementName, classNames, constructor):object  {.method}
Use this method to define and register a new element type in the modoJS library.
Element types, defined through this method are available as `modo.elementName`, after the definition process.
This elements are available for the `generator()` method, as well.

The method returns a custom object to manipulate the element definition furthermore, if necessary.
This methods can be called upon the returned definition object:

[[
    ["Method", "Description"],
    ["inheritPrototype(elementName,&nbsp;...):this", "This method inherits the prototypes of other modoJS elements. Pass the element names as string. Multiple elements may be used."],
    ["extendPrototype(object):this", "Pass an object with function definitions to that method to extend the elements prototype with them. Should be called after `inheritPrototype()`."],
    ["requireLibrary(urls):this", "If your modo element depends on a external library, you can require that library to be loaded for the modo element. Pass an URL and a object to be checked (and maybe avoid downloading). Libraries usually place a reference into the window object; for example window.jQuery, or window.ace (for ace editor). So you can choose to autoload the library, or pre-load it before modo downloads it (i.e. for desktop apps)."]
]]

More and advanced information about defining custom modoJS elements can be found in the article [Defining custom elements](defining-custom-elements).

###noConflict():void  {.method}
If you don't want modoJS to attach itself to the global object (this would be `window` in the browser context), just
call `modo.noConflict()` to remove modo from the global object and re-place the object that was there, before.

Remember to keep a reference to the modo library somewhere, or you won't be able to access it!

###isElement(object):boolean  {.method}
This function checks if the given element is of any kind of modoJS elements and returns a boolean `true` or `false`.

###isGetSetElement(object):boolean  {.method}
Checks if the passed element is a get/set enabled modoJS element.

###isDOM(object):boolean  {.method}
Checks if the passed element is a DOM node, or jQuery enhanced element.

###isInDom(element):boolean {.method}
Checks, if the passed modo element is part of the DOM.

###waitForDom(element, callback):modo {.method}
The passed callback function will be called when the passed modo element has been added to the DOM. 

###getRootElement():$  {.method}
Returns the jQuery enhanced reference to the DOM root of the application.

###reset():void  {.method}
Resets the library. Sets the internal element counter back to zero, purges the DOM root and re-sets the CSS prefix to `mdo-`.


###generate(structureArray):object  {.method}
This will generate Modo Elements from a given JSON structure. This method
helps to create complex, nested user interfaces with one step.
After the creation process, a object is returned, containing the requested references to all elements you need to interact with.

Pass a JavaScript array of objects to this function to generate multiple Modo Elements at once.
Each object must be structured like this:

    {
        type: "Container",          //String name of the element constructor in the modo namespace
        params: {},                 //Parameter object to pass to the elements constructor
        flexible: false,            //If placed inside a modo.FlexContainer element, should this element become flexible?
        ref: "my_container",        //When you need a reference to interact with the element, specify a reference idenfifier.
        key: "my_key",              //Optional element key for containers that require children to be added with a key
        hidden: true,               //Optionally hide the element directly at generation.
        disabled: true,             //Optionally disable the element directly at generation. I.e. Buttons, DropDowns, etc.
        children: [],               //Any children that should be placed inside the element go here.
        on: {                       //Optional methods to be attached to events upon generation.
            click: function(){
                //This is lazy event listening for lazy coders.
                //Be careful, you won't get rid of callbacks that are attached like that!
            }
        }
    }

You can use the modo.generate() method to create complex interfaces easily - its also possible to modularize your interface
and require parts of it from other files; even precompiled interface parts.

Take this (simple) interface as an example:

![An example layout](core/example-layout.png)

Constraints for this full-screen layout are: take up all screen width and height. This requires a few CSS stunts - maybe JavaScript.
With modo.js, its generated easily - with all interaction references directly at hand afterwards:

    var ui = modo.generate([
        {
            type: 'FlexContainer',
            ref: 'root',
            params: {
                direction: modo.FlexContainer.VERTICAL
            },
            children: [
                {
                    type: 'Container',
                    params: {
                        className: 'head-bar'   //Specify the head-bar height in a CSS rule.
                    },
                    children: [
                        {
                            type: 'Image',
                            params: {
                                className: 'logo',  //Positioning can be made in a CSS rule.
                                src: 'lib/app-logo.png'
                            }
                        }
                    ]
                },
                {
                    type: 'FlexContainer',  //Standard direction is horizontal
                    flexible: true,         //Make it stretch vertically
                    children: [
                        {
                            type: 'Container',
                            ref: 'side_bar',
                            params: {
                                className: 'sidebar'       //Specify the sidebar width in a CSS rule.
                            }
                        },
                        {
                            type: 'Container',
                            ref: 'workspace',
                            flexible: true,     //The workspace should stretch horizontally
                            params: {
                                className: 'workspace'
                            }
                        }
                    ]
                }
            ]
        }
    ]);

The method returns us a object, containing the references `root`, `side_bar` and `workspace`, since that are currently
the only parts of the interface we need to interact with.

To initialize the application interface, you call:

    modo.init(ui.root);

Which attaches the generated interface to the body tag.

If we want to add any widgets to our sidebar dynamically at any point in our application, we can simply do:

    var widget = new modo.myOwnSidebarWidget();

    ui.side_bar.add(widget);

--------------------------------------

####Precompiled interface parts
The modo.generate() method can also take pre-compiled interface parts and attach them to the currently generating
structure.

This is especially handy when your UI grows complex and you want to store parts of it in different modules.