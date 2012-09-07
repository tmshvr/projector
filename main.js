// Project: Projector
// Thomas Shaver
// Term 1209
window.addEventListener( "DOMContentLoaded", function() {
    // Get element by ID alias.
    function $( x ) {
        return document.getElementById( x );
    };

    //Create and populate select field.
    function makeComboBox( after, list, elementId ) {
        var formData = document.getElementsByTagName( "form" ), // formData is an array.
            cb = $( after ),
            selectEl = document.createElement( "select" );
            selectEl.setAttribute( "id", elementId );
        for( var i = 0, j = fileTypes.length; i < j; i++ ) {
            var op = document.createElement( "option" );
            var opText = list[ i ];
            op.setAttribute( "value", opText );
            op.innerHTML = opText;
            selectEl.appendChild( op );
        };
        cb.appendChild( selectEl );
    };

    function getDynamicItems() {
        var radios = document.forms[ 0 ].type;
        for( var i=0; i < radios.length; i++ ) {
            if( radios[ i ].checked === true ) {
                typeValue = radios[ i ].value;
            };
        };
        var comboBox = $( "language" );
        languageValue = comboBox.options[ comboBox.selectedIndex ].value;
    };

    // Store form data in localStorage.
    function storeData() {
        var item = {},
        key = $( 'author' ).value;
        getDynamicItems();
        item.project = [ "project", $( 'project' ).value ];
        item.filename = [ "filename", $( 'filename' ).value ];
        item.author = [ "author", $( 'author' ).value ];
        item.description = [ "description", $( 'description' ).value ];
        item.type = [ "type", typeValue ];
        item.language = [ "language", languageValue ];
        item.due = [ "due", $( 'due' ).value ];
        item.priority = [ "priority", $( 'priority' ).value ];
        item.created = [ "created", $( 'created' ).value ];
        localStorage[ key ] = JSON.stringify( item );
    };

    function clearData() {
        localStorage.clear();
        alert( localStorage.length === 0 ? "Cleared localStorage." : "Something's still in localStorage." );
    };

    function initStorage() { // Hack for bug in Chrome/Safari:
        if( localStorage.length === 0 ) { // If localStorage is empty, it's un-initialized and won't be accessible,
            localStorage.clear(); // but if we clear it while it's non-existent, it will be created.
        };
    };

    function initPage() {
        // Dynamically set start and due date in HTML.
        var started = new Date();
        $( 'due' ).value = ( started.getMonth() + 2 ) + "/" + started.getDate() + "/" + started.getFullYear();
        $( 'created' ).value = ( started.getMonth() + 1 ) + "/" + started.getDate() + "/" + started.getFullYear();
    };


    // Global variables.
    var fileTypes = [ "HTML", "CSS", "JavaScript", "PHP", "MySQL", "Audio", "Video", "Graphic" ],
        typeValue,
        languageValue;

    // Create the combobox/select element.
    initStorage();
    makeComboBox( "typeLabel", fileTypes, "filetype" );

    // Setup event listeners for the links and Save Data button.
    $( 'load'  ).addEventListener( "click", loadData, false );
    $( 'save'   ).addEventListener( "click", storeData, false );
    $( 'clear' ).addEventListener( "click", clearData, false );
});