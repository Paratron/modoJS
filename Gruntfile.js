module.exports = function (grunt){
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-less');

    var pkg = grunt.file.readJSON('package.json');

    var strBanner = '/**\n' +
                    '* modoJS <%= pkg.version %>\n' +
                    '* =========================\n' +
                    '* (c) 2013-2015 Christian Engel - wearekiss.com\n' +
                    '* modoJS may be freely distributed under the MIT license.\n' +
                    '* Documentation under http://docs.modojs.com' +
                    '*/\n';

    grunt.initConfig({
        pkg: pkg,
        compress: {
            main: {
                options: {
                    archive: 'dist/modo-<%= pkg.version %>-full.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['modo-<%= pkg.version %>-full.js', 'modo-<%= pkg.version %>.css'],
                        dest: '/'
                    }
                ]
            }
        },
        less: {
            development: {
                files: {
                    'dist/modo-<%= pkg.version %>-full.css': 'src/modo.less'
                }
            },
            docs: {
                files: {
                    'lib/css/style.css': 'lib/less/style.less'
                }
            },
            themes: {
                files: {
                    'themes/morphine/css/morphine.css': 'themes/morphine/less/_base.less'
                }
            }
        },
        uglify: {
            full: {
                options: {
                    banner: strBanner
                },
                src: [
                    'src/core.js',
                    'src/modules/modo-button.js',
                    'src/modules/modo-container.js',
                    'src/modules/modo-flexcontainer.js',
                    'src/modules/modo-inputtext.js',
                    'src/modules/modo-label.js',
                    'src/modules/modo-list.js',
                    'src/modules/modo-togglebutton.js',
                    'src/modules/modo-togglegroup.js',
                    'src/modules/modo-viewstack.js',
                    'src/modules/modo-popup.js',
                    'src/modules/modo-formcontainer.js',
                    'src/modules/modo-formslot.js',
                    'src/modules/modo-image.js',
                    'src/modules/modo-popupbubble.js',
                    'src/modules/modo-calendar.js',
                    'src/modules/modo-dropdown.js',
                    'src/modules/modo-grid.js',
                    'src/modules/modo-checkbox.js',
                    'src/modules/modo-toolbar.js',
                    'src/modules/modo-menu.js',
                    'src/modules/modo-keylistener.js',
                    'src/modules/modo-dateformatter.js',
                    'src/modules/modo-calendar.js',
                    'src/modules/modo-template.js',
                    'src/modules/modo-notification.js',
                    'src/modules/modo-notificationcontainer.js',
                    'src/modules/modo-slider.js',
                    'src/modules/modo-multipicker.js',
                    'src/modules/modo-tinymce.js',
                    'src/modules/modo-aceeditor.js',
                    'src/modules/modo-popBox.js',
                    'src/modules/modo-uploader.js'
                ],
                dest: 'dist/modo-<%= pkg.version %>-full.min.js'
            }

        },
        concat: {
            options: {
                banner: strBanner
            },
            dist: {
                src: [
                    'src/core.js',
                    'src/modules/modo-button.js',
                    'src/modules/modo-container.js',
                    'src/modules/modo-flexcontainer.js',
                    'src/modules/modo-inputtext.js',
                    'src/modules/modo-label.js',
                    'src/modules/modo-list.js',
                    'src/modules/modo-togglebutton.js',
                    'src/modules/modo-togglegroup.js',
                    'src/modules/modo-viewstack.js',
                    'src/modules/modo-popup.js',
                    'src/modules/modo-formcontainer.js',
                    'src/modules/modo-formslot.js',
                    'src/modules/modo-image.js',
                    'src/modules/modo-popupbubble.js',
                    'src/modules/modo-calendar.js',
                    'src/modules/modo-dropdown.js',
                    'src/modules/modo-grid.js',
                    'src/modules/modo-checkbox.js',
                    'src/modules/modo-toolbar.js',
                    'src/modules/modo-menu.js',
                    'src/modules/modo-keylistener.js',
                    'src/modules/modo-dateformatter.js',
                    'src/modules/modo-calendar.js',
                    'src/modules/modo-template.js',
                    'src/modules/modo-notification.js',
                    'src/modules/modo-notificationcontainer.js',
                    'src/modules/modo-slider.js',
                    'src/modules/modo-multipicker.js',
                    'src/modules/modo-tinymce.js',
                    'src/modules/modo-aceeditor.js',
                    'src/modules/modo-popBox.js',
                    'src/modules/modo-uploader.js'
                ],
                dest: 'dist/modo-<%= pkg.version %>-full.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js', 'src/modules/*.js'],
                tasks: ['uglify', 'concat', 'less', 'compress'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    //grunt.registerTask('default', ['uglify', 'less']);
    grunt.registerTask('default', ['concat', 'less', 'compress', 'uglify:full']);
    grunt.registerTask('css', ['less']);
};