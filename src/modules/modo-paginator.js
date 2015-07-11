/**
 * Modo Paginator
 * ==============
 * Use the Paginator element to split long dataset into chunks and render a navigation
 * at the same time. The Paginator can be used as a datasource for Lists, Dropdowns and so on.
 *
 * @param params
 * @constructor
 */
modo.Paginator = function(params){
    if(typeof params !== 'object') params = {};

    modo.Element.call(this, params);

    var settings = {
        show_buttons: (typeof params.show_buttons !== 'undefined') ? params.show_buttons : true,
        show_pages: (typeof params.show_pages !== 'undefined') ? params.show_pages : true,
        page_render_amount: params.page_render_amount || 5,
        page_render: params.page_render || function(p,i,a){
            var html = '',
                rendered = 0;

            if(a == 0 || p <= a){
                for(var i = 1; i < p;i++){
                    html += '<span data-page="'+i+'">'+i+'</span>';
                }
            }

            return html;
        }
    };
}