/**
    Multi Column Dropdown jQuery Plugin

    Author  : Fajar Chandra <contact@jar2.net>
    Date    : 2012.09.20
    Version : 0.8.3
*/

/**
This plugin converts an ordinary input/select element 
into a multi-column dropdown with search capabilities.

When converting select element into multicoldd element, all specified classes and styles are preserved.

Syntax:
    $(element).multicoldd(options);
    $(element).multicoldd(method);

Options:
    data        (JSON) Data to be listed in following format:
        [ {
                category: "Category Name",
                id: "category_id",
                panel: 0,
                items: [ { label: "Option label", value: "Option value", disabled: false } ]
        } ]
        items.value, items.disabled, and panel are optional.
    cols        (Number) Number of maximum columns.
    rows        (Number) Number of rows in a column before continuing to the next one. 
        However, items can exceed this value if maximum number of colums reached.
    title       (String) Title to be displayed on the dropdown. 
        If undefined, it will look on the element's data-mcdd-title attribute for the title.
    closeTooltip    (String) Close button tooltip.
    emptyLabel  (String) Text to be displayed on input field when nothing is selected.
    emptyValue  (String) Value to be assigned when nothing is selected.
    emptyCategory   (String) Category to be assigned when nothing is selected.
    emptyText   (String) Text to be displayed if dropdown is empty.
    emptyResultText (String) Text to be displayed if no items matching search criteria.
    panels      (JSON) Separate list into panels
        [ {
                caption: "Panel 0",
                cssClass: "panel-0",
                visibility: true
        } ]
    speed       (Number|'slow'|'fast') Speed of transitions in ms.
    isRTL       (Boolean) Set if text direction is right-to-left.
    enableHNavigation   (Boolean) Allow left and right keyboard navigation.
    enableVNavigation   (Boolean) Allow up and down keyboard navigation.
    enableType      (Boolean) Allow typing on the input field.
    enableSearch    (Boolean) Enable search feature.
    enablePreSelect (Boolean) Enable preselection if input has a matching value.
    autoSelect      (Boolean) Automatically update input value when an item is hovered.
    autoClose       (Boolean) Automatically close the dialog when an item is selected.
    autoCompleteOne (Boolean) Automatically select if only there's one option found during typing.

Events:
    select  function(sender, event)
    open    function(sender)
    close   function(sender)
        sender refers to the 'real' input element. To get other elements, you could try:
        - sender.inputUI for the wrapped input field
        - sender.container for the container of multicoldd
        - sender.dialog for the popup dialog element
    onreload function(sender, event)
    
Methods:
    .multicoldd('show')             Show the dropdown
    .multicoldd('hide')             Hide the dropdown
    .multicoldd('init', options)    Initialize multicoldd. There's no need to explicitly call this method 
        since it will be automatically called by default.
    .multicoldd('remove')           Remove multicoldd dropdown and revert back to original input element.
    .multicoldd('value' [, value])  Gets or sets selected value.
    .multicoldd('label' [, label])  Gets or sets selected label.
    .multicoldd('category' [, category])    Gets or sets selected category.
    .multicoldd('clearSelection')           Clear selected item.
    .multicoldd('reload' [, data])          Reload or assign new JSON data to the control.
    .multicoldd('enableType' [, value])     Gets or sets user typing on the input.
    .multicoldd('search', regexp [, category [, highlightMatches]])    Search for items, optionally within a specified category.
        Search results are returned as JSON object.
    .multicoldd('filter', regexp [, category])      Filter results on the dialog.
        This method is similar to 'search', except the latter returns JSON instead of jQuery object and 
        do not update the dropdown.
    .multicoldd('update')           Update input values with the currently selected item. 
        This method is intended for internal use by the plugin only.
    .multicoldd('disabled' [, value])    Disable/enable dropdown. Alternatively, you could also set the real 
        input "disabled" attribute to achieve this.

Markup:

<div class="multicoldd multicoldd-container">
    <input type="text" class="multicoldd-user-input multicoldd-toggle" />
    <div class="multicoldd-drop-arrow multicoldd-toggle">&nbsp;</div>
    <div class="multicoldd-dialog"><div class="multicoldd-wrapper">
        <div class="multicoldd-header">
            <a class="multicoldd-close">Close</a>
            <div class="multicoldd-caption">Popup title goes here</div>
        </div>
        <div class="multicoldd-content">
            <ul class="multicoldd-column">
                <li class="multicoldd-category" data-id="category_id">Category Name</li>
                <li class="multicoldd-item"><a data-value="value">Option label</a></li>
                ...
            </ul>
            ...
            <div class="multicoldd-clear"></div>
        </div>
    </div></div>

    <input type="text" class="multicoldd-value" style="display: none;" /><!-- your original input element -->
</div>

*/

// Settings are stored here.
var multicoldd = {};

//#region Where do the event handlers being bound?
// They are located either under 'init', 'show', or 'reload' method.
//#endregion

(function ($) {
    $.fn.multicoldd = function (options, args, args2, args3) {
        
        //#region Default settings
        var defaultSettings = {
            data: [],
            results: [], // Contain results of search data
            showAll: true,
            title: '&nbsp;',
            closeTooltip: 'Close',
            closeLabel: '&times;',
            emptyLabel: '',
            emptyValue: '',
            emptyCategory: '',
            emptyCategoryId: '',
            emptyText: '',
            emptyResultText: '',
            cols: 4,
            rows: 10,
            speed: 300,
            isRTL: false,
            panels: [{ caption: "", cssClass: "", visibility: true }],
            enableHNavigation: true,
            enableVNavigation: true,
            enableType: true,
            enableSearch: true,
            enablePreSelect: true,
            autoSelect: true,
            autoClose: true,
            autoCompleteOne: true,
            select: function (sender, event) { },
            open: function(sender) { },
            close: function (sender) { }
        };
        //#endregion

        //#region Non-jQuery object returning methods
        // Why did we make these methods separately from the other switches?
        // Because we need to return something else than jQuery object.
        
            //#region Properties
            // Retrieve properties if already initialized
            var input = $(this); // This is the 'real' input

            // See 'init' for initialization of these properties
            if (input.hasClass('multicoldd-value')) {
                var container = input.parent('.multicoldd');
                var id = container.attr('data-mcdd-id');
                var settings = multicoldd[id];
                var inputUI = container.children('.multicoldd-user-input'); // this is the wrapped input

                // See 'show' for initialization of these properties
                if (container.children('.multicoldd-dialog').length > 0) {
                    var dialog = container.children('.multicoldd-dialog');
                }
            }
            //#endregion

            // Methods //
            switch (options) {

                //#region Method: option
                case 'option':
                    if(args2)
                        settings[args] = args2;
                    else
                        return settings[args];
                    break;
                //#endregion

                //#region Method: clearSelection
                // Clear current selection
                case 'clearSelection':
                    inputUI.val(settings.emptyLabel);
                    input.val(settings.emptyValue);
                    input.attr('data-category', settings.emptyCategory);
                    input.attr('data-category-id', settings.emptyCategoryId);
                    break;
                //#endregion

                //#region Method: value
                // Gets or sets currently selected value
                case 'value':
                    if(args || args === '') {
                        input.val(args);

                        //#region Update values
                        // Iterate categories
                        $.each(settings.data, function(index, item) {
                            var category = {
                                category: item.category,
                                items: []
                            };

                            // Iterate items in category //
                            $.each(item.items, function(index, item2) {
                                if(item2.value == input.val()) {
                                    input.multicoldd('label', item2.label);
                                    return false;
                                }
                            });
                        });
                        //#endregion
                    }

                    return input.val();
                    break;
                //#endregion

                //#region Method: label
                // Gets or sets currently selected label
                case 'label':
                    if(args || args == '')
                        inputUI.val(args);

                    return inputUI.val();
                    break;
                //#endregion

                //#region Method: category
                // Gets or sets currently selected category
                case 'category':
                    if(args || args == '')
                        inputUI.attr('data-category', args);

                    return inputUI.attr('data-category');
                    break;
                //#endregion
                
                //#region Method: categoryId
                // Gets or sets currently selected category ID
                case 'categoryId':
                    if(args || args == '')
                        inputUI.attr('data-category-id', args);

                    return inputUI.attr('data-category-id');
                    break;
                //#endregion

                //#region Method: enableType
                // Gets or sets read-only attribute on the input
                case 'enableType':
                    if(args != undefined
                    && args != null)
                        inputUI.attr('readonly', !args);

                    return inputUI.attr('readonly') != 'readonly';
                    break;
                //#endregion

                //#region Method: search
                // Search for items, optionally within a specified category
                case 'search':
                    var results = [];
                    var highlight = (args3 == true ? true : false);

                    // Iterate categories
                    $.each(settings.data, function(index, item) {
                        // If category filter is defined, then skip all items in other categories
                        if(args2 && item.category.toLowerCase() != args2.toLowerCase())
                            return true;

                        var category = {
                            category: item.category,
                            id: item.id,
                            items: [],
                            panel: item.panel
                        };

                        // Iterate items in category //
                        $.each(item.items, function(index, item2) {
                            var regexp = new RegExp(args, "im");
                            if(regexp.test(item2.label)
                            || regexp.test(item2.value)
                            || regexp.test(item.category)) {
                                var pushedItem = {
                                    label: (highlight ? item2.label.replace(new RegExp('(' + args + ')', 'ig'), "<b>$1</b>") : item2.label),
                                    value: item2.value,
                                    disabled: item2.disabled
                                };
                                category.items.push(pushedItem);
                            }
                        });

                        // Add category to result list if an item is found within this category
                        if(category.items.length > 0) {
                            results.push(category);
                        }
                    });

                    return results;
                    break;
                //#endregion
                
                //#region Method: disabled
                case 'disabled':
                    if(args != undefined
                    && args != null)
                        input.attr('disabled', args);

                    return input.attr('disabled') == 'disabled';
                    break;
                //#endregion
                case 'id':
                    if (args != undefined
                    && args != null) {
                        inputUI.attr('id', args);
                        inputUI.attr('required', 'true');
                    }
                    if (args2 != undefined
                    && args2 != null) {
                        inputUI.attr('requiredError', args2);
                    }
                    if (args3 != undefined
                    && args3 != null) {
                        inputUI.attr('requiredempty', args3);
                    }
                    inputUI.attr('autocomplete', 'off');
                    break;
            }
            //#endregion

        //#region jQuery object returning methods
        // The following methods will return jQuery object. This will enable method chaining.
        return this.each(function () {

            //#region Properties (copied from the above Properties region)
            // Retrieve properties if already initialized
            var input = $(this); // This is the 'real' input
            var container;
            var id;
            var settings;
            var inputUI;

            // See 'init' for initialization of these properties
            if (input.hasClass('multicoldd-value')) {
                container = input.parent('.multicoldd');
                id = container.attr('data-mcdd-id');
                settings = multicoldd[id];
                inputUI = container.children('.multicoldd-user-input'); // this is the wrapped input

                // See 'show' for initialization of these properties
                if (container.children('.multicoldd-dialog').length > 0) {
                    var dialog = container.children('.multicoldd-dialog');
                }
            }
            //#endregion

            // Methods //
            switch (options) {
                //#region Method: {JSON}
                // Assign multicoldd options         
                default:
                    if (input.hasClass('multicoldd-value')) {
                        settings = $.extend(settings, options);
                        
                        // Set whether typing is enabled
                        input.multicoldd('enableType', settings.enableType);
                    }

                    $(this).multicoldd('init', options);
                    break;
                //#endregion                    

                //#region Method: init
                // Initialize multicoldd           
                case 'init':
                    // Don't initialize again if the input already converted into multicoldd
                    if (input.hasClass('multicoldd-value')) {
                        return;
                    }

                    settings = $.extend(defaultSettings, args);
                    
                    id = (input.attr('id') == null ? "MultiColDD_" : input.attr('id') + "_") + Math.floor(Math.random() * 100000);
                    multicoldd[id] = settings;

                    //#region Prepare multicoldd markups
                    container = $(
                        '<div class="multicoldd multicoldd-container">' +
                            '<input type="text" class="multicoldd-user-input multicoldd-toggle" />' +
                            '<div class="multicoldd-drop-arrow multicoldd-toggle">&nbsp;</div>' +
                        '</div>'
                    );
                    container.attr('data-mcdd-id', id).addClass(id);
                    //#endregion

                    inputUI = container.children('.multicoldd-user-input');
                    
                    // Copy attributes from input to inputUI
                    if(input.attr('tabindex') != undefined && input.attr('tabindex') != "") {
                        inputUI.attr('tabindex', input.attr('tabindex'));
                    }

                    //#region Wrap input with multicoldd

                    // Copy all classes and styles from 'real' input to faked one
                    inputUI.addClass(input.attr('class')).attr('style', input.attr('style'));

                    // Hide 'real' input
                    input.hide();

                    // Wrap 'real' input with multicoldd container
                    container.insertAfter(input);
                    input.appendTo(container);

                    // Add a class to 'real' input to ease when identifying
                    input.addClass('multicoldd-value');
                    
                    // Assign reference to elements
                    input.container = container;
                    input.inputUI = inputUI;
                    //#endregion

                    //#region Assign additional settings
                    
                    // Set whether typing is enabled
                    input.multicoldd('enableType', settings.enableType);

                    // Preselect matching item
                    if(settings.enablePreSelect && input.multicoldd('value')+'' != '') {
                        // Iterate categories
                        $.each(settings.data, function(index, item) {
                            var category = {
                                category: item.category,
                                items: []
                            };

                            // Iterate items in category //
                            $.each(item.items, function(index, item2) {
                                if(item2.value == input.val()) {
                                    input.multicoldd('label', item2.label);
                                    return false;
                                }
                            });
                        });
                    }
                    else
                        // Clear selection
                        input.multicoldd('clearSelection');

                    //#endregion

                    //#region (.multicoldd-user-input).focus
                    // Event to show multicoldd dialog
                    /*inputUI.focusin(function() {
                    //inputUI.click(function () {
                        if(input.multicoldd('disabled'))
                            return false;

                        if (!container.children('.multicoldd-dialog').length)
                            inputUI.select();
                        input.multicoldd('show');
                    });*/
                    //#endregion
                    
                    //#region (.multicoldd-user-input).click
                    // Event to show multicoldd dialog
                    inputUI.click(function () {
                        if(input.multicoldd('disabled'))
                            return false;
                        input.multicoldd('show');
                    });
                    //#endregion

                    //#region (.multicoldd-drop-arrow).click
                    // Toggle show/hide multicoldd dialog
                    container.children('.multicoldd-drop-arrow').click(function () {
                        // Only create the dialog once. If dialog already exists, then close the dialog.
                        if (container.children('.multicoldd-dialog').length > 0) {
                            input.multicoldd('hide');
                        }
                        else {
                            inputUI.focus();
                            input.multicoldd('show');
                        }
                    });
                    //#endregion

                    //#region (.multicoldd-user-input).keyup
                    // Do a filtering (search) if allowed by the settings
                    //inputUI.change(function() {
                    inputUI.keyup(function(event) {
                        if(input.multicoldd('disabled'))
                            return false;
                            
                        var dialog = container.children('.multicoldd-dialog');

                        if(!settings.enableSearch)
                            return false;

                        // Do not trigger filter on non-character keys
                        if((event.which >= 37 && event.which <= 40)
                        || (event.which > 8 && event.which <= 27))
                            return false;

                        // keep dialog opened
                        input.multicoldd('show');

                        input.multicoldd('filter', $(this).val());
                        input.val('').attr('data-category', '').attr('data-category-id', '');

                        // If autoCompleteOne is true, then automatically select if only one option is returned by filter method
                        if(settings.results.length == 1 && settings.results[0].items.length == 1) {
                            dialog.find('.multicoldd-item.multicoldd-selected').removeClass('multicoldd-selected');
                            dialog.find('.multicoldd-item').eq(0).addClass('multicoldd-selected');
                        }
                    });
                    //#endregion

                    //#region (.multicoldd-user-input).keydown
                    // Allow user to navigate using keyboard
                    inputUI.keydown(function(event) {
                        if(input.multicoldd('disabled'))
                            return false;

                        var dialog = container.children('.multicoldd-dialog');

                        // check key pressed
                        switch(event.which) {
                            //#region Down arrow
                            case 40:
                                if(!settings.enableVNavigation)
                                    return;

                                // keep dialog opened
                                input.multicoldd('show');

                                if(dialog.length) {
                                    var current = dialog.find('.multicoldd-item').index(dialog.find('.multicoldd-item.multicoldd-selected'));
                                    var length = dialog.find('.multicoldd-item').length;
                                    var next = (current + 1) % length;

                                    // Skip disabled items
                                    while(dialog.find('.multicoldd-item:eq('+next+')').hasClass('multicoldd-disabled')
                                    && next != current
                                    ) {
                                        next = (next + 1) % length;
                                    }

                                    //console.log(current + ' ' + next + ' ' + length);
                                    dialog.find('.multicoldd-item').eq(current).removeClass('multicoldd-selected');
                                    dialog.find('.multicoldd-item').eq(next).addClass('multicoldd-selected');
                                    //dialog.find('.multicoldd-item:eq('+next+') a').hover();
                                    input.multicoldd('update');
                                }
                                break;
                            //#endregion
                            
                            //#region Up arrow
                            case 38:
                                if(!settings.enableVNavigation)
                                    return;

                                // keep dialog opened
                                input.multicoldd('show');

                                if(dialog.length) {
                                    var current = dialog.find('.multicoldd-item').index(dialog.find('.multicoldd-item.multicoldd-selected'));
                                    var length = dialog.find('.multicoldd-item').length;
                                    var next = (current - 1 + length) % length;

                                    // Skip disabled items
                                    while(dialog.find('.multicoldd-item:eq('+next+')').hasClass('multicoldd-disabled')
                                    && next != current
                                    ) {
                                        next = (next - 1 + length) % length;
                                    }

                                    //console.log(current + ' ' + next + ' ' + length);
                                    // Try to use hover() to trigger events
                                    dialog.find('.multicoldd-item:eq('+current+')').removeClass('multicoldd-selected');
                                    dialog.find('.multicoldd-item:eq('+next+')').addClass('multicoldd-selected');
                                    //dialog.find('.multicoldd-item:eq('+next+') a').hover();
                                    input.multicoldd('update');
                                }
                                break;
                            //#endregion
                            
                            //#region Right arrow
                            case 39:
                                if(!settings.enableHNavigation)
                                    return;

                                // keep dialog opened
                                input.multicoldd('show');

                                if(dialog.length) {
                                    var colLength = dialog.find('.multicoldd-column').length;
                                    
                                    // Also include category in selection

                                    var currentCol = dialog.find('.multicoldd-column').index(dialog.find('.multicoldd-column:has(.multicoldd-item.multicoldd-selected)'));
                                    var current = dialog.find('.multicoldd-column:eq('+currentCol+') li')
                                        .index(dialog.find('.multicoldd-column:eq('+currentCol+') .multicoldd-item.multicoldd-selected'));
                                    var length = dialog.find('.multicoldd-column:eq('+currentCol+') li').length;

                                    var nextCol = (currentCol + 1) % colLength;
                                    var nextLength = dialog.find('.multicoldd-column:eq('+nextCol+') li').length;
                                    var next = (current >= nextLength) ? nextLength-1 : current;
                                    var nextLast = (next - 1 + nextLength) % nextLength;

                                    //console.log('c:'+currentCol+'.'+current+':'+length + ' n:'+nextCol+'.'+next+':'+nextLength); 

                                    // Skip disabled items
                                    while((
                                       dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').hasClass('multicoldd-disabled')
                                    || dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').hasClass('multicoldd-category')
                                    )
                                    && next != nextLast
                                    ) {
                                        next = (next - 1 + nextLength) % nextLength;
                                        //console.log('c:'+currentCol+'.'+current+':'+length + ' n:'+nextCol+'.'+next+':'+nextLength);
                                    }

                                    //console.log(current + ' ' + next + ' ' + length);
                                    dialog.find('.multicoldd-column:eq('+currentCol+') li:eq('+current+')').removeClass('multicoldd-selected');
                                    dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').addClass('multicoldd-selected');
                                    //dialog.find('.multicoldd-item:eq('+next+') a').hover();
                                    input.multicoldd('update');
                                }
                                break;
                            //#endregion

                            
                            //#region Left arrow
                            case 37:
                                if(!settings.enableHNavigation)
                                    return;

                                // keep dialog opened
                                input.multicoldd('show');

                                if(dialog.length) {
                                    var colLength = dialog.find('.multicoldd-column').length;
                                    
                                    // Also include category in selection

                                    var currentCol = dialog.find('.multicoldd-column').index(dialog.find('.multicoldd-column:has(.multicoldd-item.multicoldd-selected)'));
                                    var current = dialog.find('.multicoldd-column:eq('+currentCol+') li')
                                        .index(dialog.find('.multicoldd-column:eq('+currentCol+') .multicoldd-item.multicoldd-selected'));
                                    var length = dialog.find('.multicoldd-column:eq('+currentCol+') li').length;

                                    var nextCol = (currentCol - 1 + colLength) % colLength;
                                    var nextLength = dialog.find('.multicoldd-column:eq('+nextCol+') li').length;
                                    var next = (current >= nextLength) ? nextLength-1 : current;
                                    var nextLast = (next - 1 + nextLength) % nextLength;

                                    //console.log('c:'+currentCol+'.'+current+':'+length + ' n:'+nextCol+'.'+next+':'+nextLength); 

                                    // Skip disabled items
                                    while((
                                       dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').hasClass('multicoldd-disabled')
                                    || dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').hasClass('multicoldd-category')
                                    )
                                    && next != nextLast
                                    ) {
                                        next = (next - 1 + nextLength) % nextLength;
                                        //console.log('c:'+currentCol+'.'+current+':'+length + ' n:'+nextCol+'.'+next+':'+nextLength);
                                    }

                                    //console.log(current + ' ' + next + ' ' + length);
                                    dialog.find('.multicoldd-column:eq('+currentCol+') li:eq('+current+')').removeClass('multicoldd-selected');
                                    dialog.find('.multicoldd-column:eq('+nextCol+') li:eq('+next+')').addClass('multicoldd-selected');
                                    //dialog.find('.multicoldd-item:eq('+next+') a').hover();
                                    input.multicoldd('update');
                                }
                                break;
                            //#endregion

                            //#region Esc, Tab
                            // Close the dialog
                            case 27:    // ESC
                                input.multicoldd('hide');
                                break;
                            //#endregion

                            //#region Enter, Tab
                            // Select an item
                            case 13:    // ENTER
                            case 9:     // TAB
                                if(dialog.length) {
                                    if(dialog.find('.multicoldd-selected').length) {
                                        dialog.find('.multicoldd-selected a').click();
                                    }

                                    // If no item is selected, pressing tab should close the dialog
                                    else if(event.which == 9) {
                                        input.multicoldd('hide');
                                        return true;
                                    }
                                    return false;
                                }
                                break;
                            //#endregion
                        }
                    });
                    //#endregion

                    break;
                //#endregion         

                //#region Method: show
                // Show multicoldd dialog             
                case 'show':

                    // Only create the dialog once. If dialog already exists, then do nothing
                    if (container.children('.multicoldd-dialog').length > 0) {
                        return;
                    }

                    //#region Create dialog element
                    var dialog = $(
                            '<div class="multicoldd-dialog multicoldd-is-opening"><div class="multicoldd-wrapper">' +
                                '<div class="multicoldd-header">' +
                                    '<a class="multicoldd-close" title="' + settings.closeTooltip + '">' + settings.closeLabel + '</a>' +
                                    '<div class="multicoldd-caption">' + settings.title + '</div>' +
                                '</div>' +
                                '<div class="multicoldd-content">' +
                                '</div>' +
                            '</div></div>'
                        );
                    if(parseInt(dialog.children('.multicoldd-wrapper').css('min-width')) < container.width()
                    || dialog.children('.multicoldd-wrapper').css('min-width') == '')
                        // Omit padding and borders
                        dialog.children('.multicoldd-wrapper').css('min-width', 
                            container.width() - 
                            (dialog.children('.multicoldd-wrapper').outerWidth() - dialog.children('.multicoldd-wrapper').width())
                        );

                    input.dialog = dialog;

                    // Add "active" class
                    container.addClass('multicoldd-active');

                    dialog.appendTo(container);
                    //#endregion
                    
                    //#region Populate with data (JSON)
                    input.multicoldd('reload');
                    //#endregion

                    //#region Display dialog

                    // Reposition dialog if it exceeds the viewport
                    dialog.css('visibility', 'hidden');
                    dialog.css('display', 'block');
                    //console.log(dialog.offset().left + ' ' + dialog.outerWidth() + ' ' + $(window).width());
                    var margin = 20;
                    if(settings.isRTL) {
                        dialog.css('right', 0);
                        if(dialog.offset().left - margin < 0) {
                            if(dialog.outerWidth() + margin > $(window).width()) {
                                dialog.css('right', '-' + ($(window).width() - dialog.offset().left - dialog.outerWidth() - margin) + 'px');
                            }
                            else {
                                dialog.css('right', (
                                    dialog.offset().left - margin
                                ) + 'px');
                            }
                        }
                    } 
                    else {
                        dialog.css('left', 0);
                        if(dialog.offset().left + dialog.outerWidth() + margin > $(window).width()) {
                            if(dialog.outerWidth() + margin > $(window).width()) {
                                dialog.css('left', '-' + dialog.offset().left + 'px');
                            }
                            else {
                                dialog.css('left', '-' + (
                                    dialog.offset().left + 
                                    dialog.outerWidth() +
                                    margin - 
                                    $(window).width() 
                                ) + 'px');
                            }
                        }
                    }
                    // Adjust min-width
                    // Omit padding and borders
                    dialog.children('.multicoldd-wrapper').css('min-width', 
                        container.width() - 
                        (dialog.children('.multicoldd-wrapper').outerWidth() - dialog.children('.multicoldd-wrapper').width()) -
                        dialog.position().left
                    );
                    dialog.css('display', 'none');
                    dialog.css('visibility', 'visible');
                    
                    // Show dialog
                    dialog.slideDown(settings.speed, function () {
                        $(this).removeClass('multicoldd-is-opening');
                        
                        // Fire open event
                        if (settings.open) {
                            settings.open(input);
                        }

                        // Set focus to input
                        //if(!inputUI.is(':focus'))
                        inputUI.focus();
                        inputUI.select();
                    });
                    //#endregion

                    //#region (.multicoldd-close).click
                    // Event to close the multicoldd dialog
                    dialog.find('.multicoldd-close').click(function () {
                        input.multicoldd('hide');
                        //$(this).parents('.multicoldd').multicoldd('hide');
                    });
                    //#endregion

                    //#region (.multicoldd).hover
                    // Set data-mcdd-hovered attribute on body tag to let the script know 
                    // when user clicks inside or outside the dialog
                    container.hover(function () {
                        $('body').attr('data-mcdd-hovered', 'true');
                    }, function () {
                        $('body').attr('data-mcdd-hovered', 'false');
                    });
                    //#endregion
                    
                    //#region (.multicoldd).mouseover
                    // Keeps the input focused
//                    container.mouseover(function () {
//                        inputUI.focus();
//                    });
                    //#endregion

                    //#region (body).click
                    // Clicking outside the dialog (and also input) will close the dialog
                    // This function checks for data-mcdd-hovered attribute value set by (.multicoldd).hover event
                    // to determine whether user clicked inside or outside the dialog
                    $(window).click(function (event) {
                        if ($('body').attr('data-mcdd-hovered') == 'false') {
                            $('body').unbind(event);
                            $('.multicoldd .multicoldd-dialog:not(.multicoldd-is-opening) .multicoldd-close').click();
                        }
                    });
                    //#endregion

                    break;
                //#endregion            

                //#region Method: hide
                // Hide multicoldd dialog         
                case 'hide':
                case 'close':
                    // Reset events & other properties
                    $('body').removeAttr('data-mcdd-hovered');
                    container.unbind('hover');
                    container.unbind('mouseover');

                    // Display empty label if nothing is selected
                    if(!input.multicoldd('value'))
                        input.multicoldd('label', settings.emptyLabel);
                        
                    // Remove "active" class
                    container.removeClass('multicoldd-active');
                    
                    // Cleanup search/filter
                    settings.showAll = true;

                    // Close dialog
                    if(dialog)
                        dialog.slideUp(settings.speed, function () {
                        $(this).remove();
                        if (settings.close)
                            settings.close(input);
                    });
                    break;
                //#endregion       

                //#region Method: remove
                // Remove multicoldd and return the input to its original form                   
                case 'remove':
                    // Nothing to do if it's not yet initialized
                    if (!input.hasClass('multicoldd-value')) {
                        return;
                    }

                    // Move input outside container
                    input.insertBefore(container);

                    // Remove multicoldd elements
                    container.remove();

                    // Reset values
                    input.removeClass('multicoldd-value');
                    input.show();

                    break;
                //#endregion
                
                //#region Method: add
                // Add an item to the list
                case 'add':
                    if(args.category == null)
                        args.category = '$default';

                    settings.data[args.category].push(args);
                    break;
                //#endregion
                
                //#region Method: reload
                // Reload data
                case 'reload':
                    if(args)
                        settings.data = args;

                    // If dialog is currently opened, then repopulate with data
                    
                    //#region Populate with data (JSON)
                        // Cleanup items
                        dialog.find('.multicoldd-content').empty();
                        //input.multicoldd('clearSelection');
                    
                        // Check if settings.showAll state is 1 then grab all data
                        if(settings.showAll) {
                            settings.results = settings.data;
                        }

                        if (settings.results
                        && settings.results.length > 0) {
                            //#region Count number of items on the list (including categories)
                            // The purpose of this is to prevent having category name on the end of any column
                            var itemCount = 0;
                            var itemCountAdjusted = 0; // Item count + adjustment
                            var rowCount = 0;
                            $.each(settings.results, function (index, item) {
                                itemCount++;
                                itemCount += item.items.length;
                            });
                            //#endregion

                            //#region Calculate how many cols and rows needed
                            if(settings.rows * settings.cols < itemCount) {
                                var maxRows = Math.ceil(itemCount / settings.cols);
                            }
                            else {
                                var maxRows = settings.rows;
                            }
                            var maxCols = Math.ceil(itemCount / maxRows);
                            //#endregion
                        
                            //#region Add items to the list
                            var count = 0;
                            var dataList;
                            var lastPanelNo = 0;
                            var hasSelection = false;
                            $.each(settings.results, function (index, item) {
                                count++;

                                // Check if panel is defined, if not, default to 0
                                if(!item.panel)
                                    item.panel = 0;

                                if(settings.panels[item.panel].visibility != undefined
                                && !settings.panels[item.panel].visibility) {
                                    return;
                                }

                                // Append category name
                                /* Switch to new column if any of the following condition meets */
                                if(
                                   count >= maxRows /* if number of items reached max rows */
                                || index == 0 /* if this is the first item */
                                || item.panel != lastPanelNo /* if category has different panel no than previous one */
                                //|| (count == maxRows - 1 && item.items.length > 2) /* If there are more than 2 items in category and only one item is on the last row */
                                ) {
                                    var panel = {
                                        caption: "",
                                        cssClass: ""
                                    };
                                    if(settings.panels[item.panel]) {
                                        if(settings.panels[item.panel].caption)
                                            panel.caption = settings.panels[item.panel].caption;
                                        if(settings.panels[item.panel].cssClass)
                                            panel.cssClass = settings.panels[item.panel].cssClass;
                                    }
                                    if(item.panel != lastPanelNo) 
                                        var isNewPanel = true;
                                    else
                                        var isNewPanel = false;
                                    
                                    dataList = $(
                                        '<ul class="' + 
                                            'multicoldd-column ' + 
                                            panel.cssClass + ' ' +
                                            (panel.caption ? 'multicoldd-column-has-caption ' : '') +
                                        '">' + 
                                            (isNewPanel ? '<div class="multicoldd-column-caption">' + panel.caption + '</div>' : "") +
                                        '</ul>'
                                    );
                                    dataList.appendTo(dialog.find('.multicoldd-content'));
                                    lastPanelNo = item.panel;
                                    count = 1;
                                }
                                dataList.append('<li class="multicoldd-category" data-id="' + (typeof(item.id) == 'string' ? item.id : "") + '">' + item.category + '</li>');

                                // Append items in this category
                                $.each(item.items, function(index, item2) {
                                    count++;
                                    
                                    /* Switch to new column number of items added exceed max rows
                                       but force adding to the same column if this is the last item in the category. */
                                    if(count > maxRows && index < item.items.length -1) {
                                        var panel = {
                                            caption: "",
                                            cssClass: ""
                                        };
                                        if(settings.panels[item.panel]) {
                                            if(settings.panels[item.panel].caption)
                                                panel.caption = settings.panels[item.panel].caption;
                                            if(settings.panels[item.panel].cssClass)
                                                panel.cssClass = settings.panels[item.panel].cssClass;
                                        }
                                        var isNewPanel = false;
                                    
                                        dataList = $(
                                            '<ul class="' + 
                                                'multicoldd-column ' + 
                                                panel.cssClass + ' ' +
                                                (panel.caption ? 'multicoldd-column-has-caption ' : '') +
                                            '">' + 
                                                (isNewPanel ? '<div class="multicoldd-column-caption">' + panel.caption + '</div>' : "") +
                                            '</ul>'
                                        );
                                        dataList.appendTo(dialog.find('.multicoldd-content'));
                                        count = 0;
                                    }
                                    var selected = false;
                                    if(item2.value == input.val() && hasSelection == false) {
                                        hasSelection = true;
                                        selected = true;
                                    }
                                    dataList.append(
                                        '<li class="multicoldd-item ' + 
                                            (item2.disabled ? 'multicoldd-disabled ' : '') + 
                                            (selected ? 'multicoldd-selected ' : '') +
                                            '">' + 
                                            '<a data-value="' + item2.value + '" data-category="' + item.category + '" data-category-id="' + item.id +'">' + 
                                                item2.label + 
                                            '</a>' + 
                                        '</li>'
                                    );
                                });
                            });
                            //#endregion
                        
                            // Clearfix
                            dialog.find('.multicoldd-content').append(
                                '<div class="multicoldd-clear"></div>'
                            );
                            
                            //#region Update dialog size
                                var columnWidth = dataList.outerWidth() + parseInt(dataList.css('margin-left')) + parseInt(dataList.css('margin-right'));
                                // FIX#120502 Update maxCols with realization of number of columns added
                                maxCols = dialog.find('.multicoldd-content ul.multicoldd-column').length;
                                var padding = 
                                    (dialog.find('.multicoldd-content').outerWidth() - dialog.find('.multicoldd-content').width()) + 
                                    (dialog.children('.multicoldd-wrapper').outerWidth() - dialog.children('.multicoldd-wrapper').width()) ;
                                dialog.children('.multicoldd-wrapper').css('width', (maxCols * columnWidth + padding) + 'px');
                            //#endregion
                            //console.log('col = ' + maxCols + ' count = ' + itemCount + ' row = ' + maxRows);
                        }
                        else if(!settings.data || settings.data.length == 0) {
                            dialog.children('.multicoldd-wrapper').css('width', '0px');
                            dialog.find('.multicoldd-content').append(
                                '<div class="multicoldd-empty">'+ settings.emptyText +'</div>'
                            );
                        }
                        else {
                            dialog.children('.multicoldd-wrapper').css('width', '0px');
                            dialog.find('.multicoldd-content').append(
                                '<div class="multicoldd-empty">'+ settings.emptyResultText +'</div>'
                            );
                        }

                        input.dialog = dialog;
                        if(settings.onreload)
                            settings.onreload(input);

                    //#endregion

                    //#region (.multicoldd-item a).hover
                    // Mark hovered item as selected
                    dialog.find('.multicoldd-item a').hover(function () {
                        dialog.find('.multicoldd-item.multicoldd-selected').removeClass('multicoldd-selected');
                        $(this).parent('.multicoldd-item').addClass('multicoldd-selected');

                        //#region Update input values if autoSelect is enabled
                        if(settings.autoSelect) {
                            input.multicoldd('update');
                        }
                        //#endregion
                    }, function() {
                        $(this).parent('.multicoldd-item').removeClass('multicoldd-selected');
                    });
                    //#endregion

                    //#region (.multicoldd-item a).click
                    // Select an item
                    dialog.find('.multicoldd-item a').click(function () {
                        if ($(this).parent('.multicoldd-item').hasClass('multicoldd-disabled'))
                            return false;

                        $(this).parent('.multicoldd-item').addClass('multicoldd-selected');
                        input.multicoldd('update');

                        if(settings.select)
                            settings.select(input, {
                                label: inputUI.val(),
                                value: input.val(),
                                category: $(this).attr('data-category'),
                                categoryId: $(this).attr('data-category-id')
                            });

                        if(settings.autoClose)
                            dialog.find('.multicoldd-close').click();
                        return false;
                    });
                    //#endregion
                    break;
                //#endregion

                //#region Method: filter
                // Filter results on the dialog
                case 'filter':
                    if(args == '')
                        settings.showAll = true;
                    else {
                        settings.results = input.multicoldd('search', args, args2, true);
                        settings.showAll = false;
                    }
                    
                    input.multicoldd('reload');
                    break;
                //#endregion

                //#region Method: update
                // Update values by the currently selected item
                // This method is intended to be used internally
                case 'update':
                    var selectedItem = dialog.find('.multicoldd-item.multicoldd-selected');
                    if (selectedItem.hasClass('multicoldd-disabled'))
                        return false;

                    // Assign values
                    inputUI.val(selectedItem.children('a').text()); // see below
                    //inputUI.attr('value', selectedItem.children('a').text());

                    input.val(selectedItem.children('a').attr('data-value')); // see below
                    /*if(input.is('textarea'))
                        input.text(selectedItem.children('a').attr('data-value'));
                    else
                        input.attr('value', selectedItem.children('a').attr('data-value'));*/

                    inputUI.attr('data-category', selectedItem.children('a').attr('data-category'));
                    inputUI.attr('data-category-id', selectedItem.children('a').attr('data-category-id'));

                    inputUI.select();
                    break;
                //#endregion
            }
        });
        //#endregion
    }
})(jQuery);
