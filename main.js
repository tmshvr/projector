// Project: Projector
// Thomas Shaver
// Term 1209
window.addEventListener( "DOMContentLoaded", function() {
    function $( x ) { // Get element by ID.
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

    // Global variables.
    var fileTypes = [ "HTML", "CSS", "JavaScript", "PHP", "MySQL", "Audio", "Video", "Graphic" ];

    // Create the combobox/select element.
    makeComboBox( "typeLabel", fileTypes, "filetype" );

    // Setup event listeners for the links and Save Data button.
    $( 'load'  ).addEventListener( "click", loadData, false );
    $( 'save'   ).addEventListener( "click", storeData, false );
    $( 'clear' ).addEventListener( "click", clearData, false );
});