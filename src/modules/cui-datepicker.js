/**
 * CUI DatePicker
 * ==============
 * The CUI DatePicker element can be used to let your users select a specific date from a calendar, or enter it directly into
 * the textbox (optionally).
 * @param params
 * @constructor
 */
CUI.DatePicker = function(params){
    if(typeof params !== 'object') params = {};

    CUI.Element.call(this, params);

    var settings = {
        manual_input: params.manual_input || true
    };

    var display;
    if(settings.manual_input){
        display = new CUI.InputText();
        display.on('blur', function(){

        });
    } else {
        display = new CUI.Label();
    }
};