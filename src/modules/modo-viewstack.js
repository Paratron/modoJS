/**
 * modo-Viewstack
 * ===========
 * description
 */
(function (){
    'use strict';

    var modoCore,
        $;

    $ = jQuery;

    //commonJS and AMD modularization - try to reach the core.
    if(typeof modo !== 'undefined'){
        modoCore = modo;
    } else {
        if(typeof require === 'function'){
            modoCore = require('modo');
        }
    }

    function cn(index, prefixed){
        if(prefixed !== undefined){
            return modoCore.ViewStack.classNames[index];
        }
        return modoCore.cssPrefix + modoCore.ViewStack.classNames[index];
    }

    modoCore.defineElement('ViewStack', ['viewstack'], function (params){
        params = params || {};

        modoCore.Container.call(this, params);

        var pAdd,
            pRemove;

        this.addClass(cn(0, true));

        pAdd = modoCore.ViewStack.prototype.add;
        pRemove = modoCore.ViewStack.prototype.remove;

        this.elements = {};
        this.count = 0;
        this.displaying = 0;
        this.switchMethod = params.switchMethod;

        /**
         * The behaviour of this add() function is different to the behaviour of the modoCore.Container's add() function.
         * You have to add a key/value object here, where the value is a modo element.
         * Example:
         * {
         *   "test": new modoCore.Button()
         * }
         *
         * So you can show this element by calling display('test');
         * @param object
         */
        this.add = function (object, options){
            var key,
                silent;

            if(modoCore.isElement(object) || modoCore.isDOM(object)){
                throw new Error('Do not pass modo.* or DOM elements here, directly');
            }

            options = options || {};

            silent = options.silent;

            for (key in object) {
                this.elements[key] = object[key];

                this.count++;
                if(this.count === 1){
                    object[key].show();
                    this.displaying = key;
                    this.trigger('display', key); //in here for legacy reasons. Will be @deprecated
                    this.trigger('change', key);
                } else {
                    object[key].hide();
                }

                pAdd.call(this, object[key], {silent: true});
                var eobj = {};
                eobj[key] = object[key];
                if(!silent){
                    this.trigger('add', eobj);
                }
            }

            return this;
        };

        /**
         * Pass in a key, to remove the specified object from the viewStack.
         * @param {String} key
         */
        this.remove = function (key, options){
            var eobj,
                inKey,
                silent;

            options = options || {};

            silent = options.silent;

            if(typeof this.elements[key] === 'undefined'){
                throw new Error('Object not part of this Container');
            }
            pRemove.call(this, this.elements[key], {silent: true});
            eobj = {};
            eobj[key] = this.elements[key];
            delete this.elements[key];
            this.count--;
            if(!silent){
                this.trigger('remove', eobj);
            }

            if(this.displaying === key){
                this.displaying = null;
                if(!this.count){
                    return;
                }
                for (inKey in eobj.elements) {
                    this.display(inKey);
                    return;
                }
            }

            return this;
        };

        this.getElements = function (){
            return this.elements;
        };

        modoCore._stat('ViewStack');
    })
        .inheritPrototype('Container')
        .extendPrototype({
            /**
             * This will show the specified element and hide all others.
             * @param {String} key
             */
            set: function (key){
                var showElement,
                    hideElement,
                    inKey;

                if(typeof this.elements[key] === 'undefined'){
                    throw new Error('Object not part of this Container');
                }

                showElement = this.getElementByKey(key);
                if(this.displaying){
                    hideElement = this.getElementByKey(this.displaying);
                }

                if(typeof this.switchMethod === 'function'){
                    this.switchMethod(hideElement, showElement);
                } else {
                    if(hideElement){
                        hideElement.hide();
                    }
                    showElement.show();
                }

                this.displaying = key;
                this.trigger('display', key); //In here for legacy reasons. Will be @deprecated
                this.trigger('change', key);

                return this;
            },

            get: function(){
                return this.displaying;
            },

            /**
             * Returns the Element with the given key.
             * @param key
             * @returns {*}
             */
            getElementByKey: function(key){
                if(this.elements[key] === undefined){
                    throw new Error('Element does not exist');
                }
                return this.elements[key];
            }
        });

    if(typeof exports !== 'undefined'){
        //commonJS modularization
        exports = modoCore.ViewStack;
    } else {
        if(typeof define === 'function'){
            //AMD modularization
            define('ViewStack', [], function (){
                return modoCore.ViewStack;
            });
        }
    }
})();