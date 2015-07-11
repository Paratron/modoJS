/**
 * modoJS ImagePicker
 * ==================
 * The ImagePicker element renders a little preview of the selected image and provides a dialog window
 * to let the user choose from a collection of images.
 * The element is get/set enabled - so it can be used inside of form containers.
 *
 * Heads up: you propably need some kind of serverside support script to generate a image array for this
 * element so it knows which images are available for selection.
 */
(function (){
    'use strict';

    var modoCore,
        pickerDialog;

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
            return modoCore.ImagePicker.classNames[index];
        }
        return modoCore.cssPrefix + modoCore.ImagePicker.classNames[index];
    }

    modoCore.defineElement('ImagePicker', ['imagepicker', 'preview-image-container', 'imagepicker-popup', 'imagepicker-reset', 'imagepicker-resetable', 'imagepicker-search'], function (params){
        params = params || {};

        modoCore.Element.call(this, params);

        this.addClass(cn(0, true));

        if(params.search === undefined){
            params.search = modoCore.ImagePicker.defaults.search;
        }

        this._imagePreview = new modoCore.Image({
            className: params.imageClassName || modoCore.ImagePicker.defaults.imageClassName,
            value: params.placeholderImage || modoCore.ImagePicker.defaults.placeholderImage
        });

        this._pickButton = new modoCore.Button({
            className: params.buttonClassName || modoCore.ImagePicker.defaults.buttonClassName,
            label: params.buttonLabel || modoCore.ImagePicker.defaults.buttonLabel
        });

        var that = this;

        this._pickButton.on('click', function (){
            pickerDialog._pickerRef = that;
            pickerDialog.lblWindowTitle.set(params.pickerDialogTitle || modoCore.ImagePicker.defaults.pickerDialogTitle);
            pickerDialog.btnConfirm.setLabel(params.pickerDialogConfirm || modoCore.ImagePicker.defaults.pickerDialogConfirm);
            pickerDialog.btnCancel.setLabel(params.pickerDialogCancel || modoCore.ImagePicker.defaults.pickerDialogCancel);
            pickerDialog.lstImages.set(that._images ? that._images : modoCore.ImagePicker.defaults.images);
            pickerDialog.filter = '';
            updateFunction();
            pickerDialog.btnConfirm.disable();

            if(that._search){
                pickerDialog.txtSearch.show().set('').el.attr('placeholder', that._searchPlaceholder);
            } else {
                pickerDialog.txtSearch.hide();
            }

            pickerDialog.window.open();

            if(that._search){
                pickerDialog.txtSearch.focus();
            }

            if(that._selected){
                pickerDialog.lstImages.el.find('.mdo-selected')[0].scrollIntoView();
            }
        });

        this.el.append('<div class="' + cn(1) + (params.imageContainerClassName ? ' ' + params.imageContainerClassName : modoCore.ImagePicker.defaults.imageContainerClassName) + '"></div>', this._pickButton.el);

        this.el.find('.' + cn(1)).append(this._imagePreview.el);

        this._placeholderImage = params.placeholderImage || modoCore.ImagePicker.defaults.placeholderImage;
        this._images = params.images || null;
        this._thumbBasePath = params.thumbBasePath || modoCore.ImagePicker.defaults.thumbBasePath;
        this._selected = null;
        this._search = params.search === undefined ? modoCore.ImagePicker.defaults.search : params.search;
        this._searchPlaceholder = params.searchPlaceholder === undefined ? modoCore.ImagePicker.defaults.searchPlaceholder : params.searchPlaceholder;

        if(params.resetable !== false){
            this._resetButton = new modoCore.Button({
                label: '✖',
                className: cn(3) + ' tme-big'
            });

            this._resetButton.on('click', function (){
                that.set(null);
            });

            this.el.append(this._resetButton.el);
        }
    })
        .inheritPrototype('Element')
        .extendPrototype({
            /**
             * Returns the path of the selected image.
             * @param [fullObject] Set to true to retrieve the full image object (file, thumb, title) instead of only the filename.
             */
            get: function (fullObject){
                if(!fullObject){
                    return this._selected;
                }

                _.find(this._images ? this._images : modoCore.ImagePicker.defaults.images, function (item){
                    if(item.file == value){
                        that._selected = value;
                        that._imagePreview.set(that._thumbBasePath + item.thumb);
                        return true;
                    }
                });
            },

            /**
             * Will set the elements selected image file.
             * @param value
             * @param options
             */
            set: function (value, options){
                var that = this,
                    silent;

                options = options || {};

                silent = options.silent;

                if(!value){
                    that._selected = null;
                    that._imagePreview.set(that._placeholderImage || modoCore.ImagePicker.defaults.placeholderImage);
                } else {
                    _.find(this._images ? this._images : modoCore.ImagePicker.defaults.images, function (item){
                        if(item.file == value){
                            that._selected = value;
                            that._imagePreview.set(that._thumbBasePath + item.thumb);
                            return true;
                        }
                    });

                    if(that._selected !== value){
                        throw new Error('Image not found in image set');
                    }
                }

                if(this._resetButton){
                    if(this._selected){
                        this.addClass(cn(4, true));
                    } else {
                        this.removeClass(cn(4, true));
                    }
                }

                if(!silent){
                    this.trigger('change', value);
                }
            },

            setImages: function (images){
                this._images = images;
            }
        });

    modoCore.ImagePicker.defaults = {
        images: [],
        thumbBasePath: '',
        placeholderImage: '',
        pickerDialogTitle: 'Pick an image',
        pickerDialogConfirm: 'Use this image',
        pickerDialogCancel: 'Cancel',
        buttonLabel: 'Pick an image',
        buttonClassName: 'tme-big',
        imageClassName: '',
        imageContainerClassName: '',
        search: false,
        searchPlaceholder: 'Search...'
    };

    /**
     * Sets the new default images for all image pickers and triggers a list update
     * on all image pickers that use the default images.
     */
    modoCore.ImagePicker.setImages = function (images){
        modoCore.ImagePicker.defaults.images = images;
        if(!pickerDialog._pickerRef){
            return;
        }
        if(!pickerDialog._pickerRef._images){
            pickerDialog.lstImages.set(images);
        }
    };

    function updateFunction(){
        pickerDialog.lstImages.update();
    }

    var searchTimeout;

    pickerDialog = modoCore.ImagePicker._pickerDialog = modoCore.generate([
        {
            type: 'PopUp',
            ref: 'window',
            params: {
                className: cn(2),
                modal: true
            },
            children: [
                {
                    type: 'Container',
                    params: {
                        className: 'tme-header'
                    },
                    children: [
                        {
                            type: 'Label',
                            ref: 'lblWindowTitle',
                            params: {
                                className: 'tme-title'
                            }
                        },
                        {
                            type: 'Button',
                            params: {
                                className: 'tme-close'
                            },
                            on: {
                                click: function (){
                                    pickerDialog.window.close();
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'Container',
                    params: {
                        className: 'tme-body'
                    },
                    children: [
                        {
                            type: 'InputText',
                            ref: 'txtSearch',
                            params: {
                                className: cn(5),
                                type: 'search',
                                placeholder: ''
                            },
                            on: {
                                keydown: function (){
                                    pickerDialog.filter = this.get();

                                    clearTimeout(searchTimeout);
                                    searchTimeout = setTimeout(function (){
                                        updateFunction();
                                    }, 100);
                                },
                                change: function (){
                                    pickerDialog.filter = this.get();

                                    clearTimeout(searchTimeout);
                                    searchTimeout = setTimeout(function (){
                                        updateFunction();
                                    }, 100);
                                }
                            }
                        },
                        {
                            type: 'List',
                            ref: 'lstImages',
                            params: {
                                data: [],
                                collector: function (d){
                                    if(!pickerDialog || !pickerDialog.filter){
                                        return d;
                                    }

                                    return _.filter(d, function (elm){
                                        return elm.title.indexOf(pickerDialog.filter) !== -1;
                                    });
                                },
                                itemRender: function (d){
                                    return '<div class="' + (d.file == pickerDialog._pickerRef._selected ? 'mdo-selected' : '') + '"><img src="' + pickerDialog._pickerRef._thumbBasePath + d.thumb + '"><div><b>' + d.title + '</b><span>' + d.info.width + 'x' + d.info.height + ' px, ' + d.info.size + '</span></div></div>';
                                },
                                itemEvents: {
                                    click: function (e, i, d){
                                        pickerDialog._selected = d;
                                        $(this).parent().find('.mdo-list-item').removeClass('mdo-selected');
                                        $(this).addClass('mdo-selected');
                                        pickerDialog.btnConfirm.enable();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'Container',
                    params: {
                        className: 'tme-footer'
                    },
                    children: [
                        {
                            type: 'Button',
                            ref: 'btnCancel',
                            params: {
                                label: ''
                            },
                            on: {
                                click: function (){
                                    pickerDialog.window.close();
                                }
                            }
                        },
                        {
                            type: 'Button',
                            ref: 'btnConfirm',
                            params: {
                                className: 'tme-big tme-actionbutton',
                                label: ''
                            },
                            on: {
                                click: function (){
                                    pickerDialog._pickerRef.set(pickerDialog._selected.file);
                                    pickerDialog.window.close();
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]);

    if(typeof exports !== 'undefined'){
        //commonJS modularization
        exports = modoCore.ImagePicker;
    } else {
        if(typeof define === 'function'){
            //AMD modularization
            define('ImagePicker', [], function (){
                return modoCore.ImagePicker;
            });
        }
    }
})();