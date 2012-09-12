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
            selectEl = document.createElement( "select" ),
            i, j, op, opText;
            selectEl.setAttribute( "id", elementId );
        for( i = 0, j = fileTypes.length; i < j; i++ ) {
            op = document.createElement( "option" );
            opText = list[ i ];
            op.setAttribute( "value", opText );
            op.innerHTML = opText;
            selectEl.appendChild( op );
        };
        cb.appendChild( selectEl );
    };

    function getDynamicItems() {
        var radios = document.forms[ 0 ].type, i, comboBox;
        for( i=0; i < radios.length; i++ ) {
            if( radios[ i ].checked === true ) {
                typeValue = radios[ i ].value;
            };
        };
        comboBox = $( "filetype" );
        fileTypeValue = comboBox.options[ comboBox.selectedIndex ].value;
    };

    // From SDI Project 4 library.
    function toTitleCase( string ) {
        var words = string.split( " " ), // Split the argument into single words.
            i, ttc;
        for( i = 0; i < words.length; i++ ) { // For each of the words in the words array:
          ttc = words[ i ].charAt(0); // Get the first character in the word,
          ttc = ttc.toUpperCase(); // and change it to uppercase,
          ttc += words[ i ].substring( 1 ); // and make it the first letter of the word.
          words[ i ] = ttc; // and put the word with the capitalized first letter into the words array.
        };
        return words.join( " " );
    };

    // From SDI Project 4 library.
    function dateDifference( date1, date2 ) {
        // date1 is the numerically greater date; date2 is numerically lesser.
        var ms, seconds, mins, hours, days;
        date1 = new Date( date1 ); // Sets date1 to the date in milliseconds.
        date2 = new Date( date2 );
        ms = date1 - date2;
        seconds = ms / 1000; // 1000 ms to a second.
        mins = seconds / 60; // 60 seconds to a minute.
        hours = mins / 60; // 60 mins to an hour.
        days = hours / 24; // 24 hours to a day.
        // Return an array of whole number values of the number of hours and days between the dates.
        return [ Math.floor( hours ), Math.floor( days )];
    };

    function validateData( jsonObject ) {
        var valid = "", dd;
        if( jsonObject.project === "" || jsonObject.project === undefined ) {
            valid = "project is invalid: " + jsonObject.project;
        };
        if( jsonObject.filename === "" || jsonObject.filename === undefined ) {
            valid = "filename is invalid: " + jsonObject.filename;
        };
        if( jsonObject.author === "" || jsonObject.author === undefined ) {
            valid = "author is invalid: " + jsonObject.author;
        };
        if( jsonObject.description === "" || jsonObject.description === undefined ) {
            valid = "description is invalid: " + jsonObject.description;
        };
        if( jsonObject.type === "" || jsonObject.type === undefined ) {
            valid = "type is invalid: " + jsonObject.type;
        };
        if( jsonObject.filetype === "" || jsonObject.filetype === undefined ) {
            valid = "filetype is invalid: " + jsonObject.filetype;
        };
        if( jsonObject.due === "" || jsonObject.due === undefined ) {
            valid = "due date is invalid: " + jsonObject.due;
        };
        if( jsonObject.priority === "" || jsonObject.priority === undefined ) {
            valid = "priority is invalid: " + jsonObject.priority;
        };
        if( jsonObject.created === "" || jsonObject.created === undefined ) {
            valid = "created is invalid: " + jsonObject.created;
        };
        dd = dateDifference( jsonObject.due, jsonObject.created );
        if( dd[ 0 ] < 0 || dd[ 1 ] < 0 ) {
            valid = "Due date is before start date.";
        };
        return valid;
    };

    function loadData() {
        var dA = $( 'displayArea' ),
            makeDiv, makeList, makeLi, key, value, obj, makeSubList, makeSubLi, optSubText, len, i, n;
        if( dA ) {
            dA.parentNode.removeChild( dA );
        };
        makeDiv = document.createElement( 'div' );
        makeDiv.setAttribute( "id", "displayArea" );s
        makeList = document.createElement( 'ul' );
        makeDiv.appendChild( makeList );
        document.body.appendChild( makeDiv );
        for( i = 0, len = localStorage.length; i < len; i++ ) {
            makeLi = document.createElement( 'li' );
            makeList.appendChild( makeLi );
            linksLi = document.createElement( 'ul' );
            key = localStorage.key( i );
            value = localStorage.getItem( key );
            obj = JSON.parse( value );
            makeSubList = document.createElement( 'ul' );
            makeSubList.setAttribute( "class", "listing" );
            makeSubList.appendChild( linksLi );
            makeLi.appendChild( makeSubList );
            for( n in obj ) {
                makeSubLi = document.createElement( 'li' );
                makeSubLi.setAttribute( "class", "item" );
                makeSubList.appendChild( makeSubLi );
                optSubText = toTitleCase( obj[ n ][ 0 ] ) + ": " + obj[ n ][ 1 ];
                makeSubLi.innerHTML = optSubText;
            };
            makeItemLinks( localStorage.key(i), linksLi );
        };
        $( 'formarea' ).style.display = "none";
        $( 'load' ).style.display = "none";
        $( 'back' ).style.display = "inline";
    };

    // Store form data in localStorage.
    function storeData() {
        var item = {}, key, isValid;
            getDynamicItems();  
            key = $( 'project' ).value + "\/" + $( 'filename' ).value;
            item.project = [ "project", $( 'project' ).value ];
            item.filename = [ "filename", $( 'filename' ).value ];
            item.author = [ "author", $( 'author' ).value ];
            item.description = [ "description", $( 'description' ).value ];
            item.type = [ "type", typeValue ];
            item.filetype = [ "filetype", filetypeValue ];
            item.due = [ "due", $( 'due' ).value ];
            item.priority = [ "priority", $( 'priority' ).value ];
            item.created = [ "created", $( 'created' ).value ];
        isValid = validateData( item );
        // If the data is not valid, it shouldn't be stored.        
        if( isValid === "" ) { // Found no errors in the data.
            localStorage[ key ] = JSON.stringify( item );
        }
        else {
            alert( isValid );
        };
    };

    function makeItemLinks( key, linksLi ) {
        // Create a control to edit an item from the localStorage list.
        var editLink = document.createElement( "a" );
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit File";
        editLink.addEventListener( "click", editItem );
        editLink.innerHTML = editText;
        linksLi.appendChild( editLink );

        
        var breakTag = document.createElement( 'br' );

        // Create a control to delete an item from the localStorage list.
        var deleteLink = document.createElement( "a" );
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Edit File";
        deleteLink.addEventListener( "click", editItem );
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild( deleteLink );
    };

    function editItem() {
        var value = localStorage.getItem( this.key ); // The .key value from the editLink that was clicked.
        var item = JSON.parse( value );
        // Show the form
        toggleControls( "off" );

        // Populate the form fields with data from localStorage.

        // Remove the eventListener for the submit button.
        $( 'save' ).removeEventListener( "click", validate );

        // Change submit button value to Edit File.
        $( 'save' ).value = "Save Edited";
        var editSubmit = $( 'save' );
        // Save the key est. in this function as a property of the submit button.
        editSubmit.addEventListener( "click", validate );
        editSubmit.key = this.key;
    };

    function deleteItem() {
        var ask = confirm( "Are you sure?" );
        if( ask) {
            localStorage.deleteItem( this.key );
            alert( this.key + " was deleted." );
            window.location.reload();
        }
        else {
            alert( this.key + " was not deleted." );
        };
    };

    function clearData() {
        localStorage.clear();
        alert( localStorage.length === 0 ? "Cleared localStorage." : "Something's still in localStorage." );
    };

    function toggleControls( status ) {
        switch( status ) {
            case "off":
                $( 'formarea' ).style.display = "none";
                $( 'load' ).style.display = "none";
                $( 'back' ).style.display = "";
                break;
            case "on":
                $( 'formarea' ).style.display = "";
                $( 'load' ).style.display = "";
                $( 'back' ).style.display = "none";
                break;
        };
    };

    function goBack() {
        var dA = $( 'displayArea' );
        if( dA ) {
            dA.parentNode.removeChild( dA );
        };
    };

    function initStorage() { // Hack for bug in Chrome/Safari:
        if( localStorage.length === 0 ) { // If localStorage is empty, it's un-initialized and won't be accessible,
            localStorage.clear(); // but if we clear it while it's non-existent, it will be created.
        };
    };

    // Global variables.
    var fileTypes = [ "HTML", "CSS", "JavaScript", "PHP", "MySQL", "Audio", "Video", "Graphic" ],
        typeValue,
        filetypeValue,
        started = new Date();

    // Create the combobox/select element.
    makeComboBox( "typeLabel", fileTypes, "filetype" );

    // Let the hack do it's work.
    initStorage();

    // Initialize the due and created dates.
    $( 'due' ).value = ( started.getMonth() + 2 ) + "/" + started.getDate() + "/" + started.getFullYear();
    $( 'created' ).value = ( started.getMonth() + 1 ) + "/" + started.getDate() + "/" + started.getFullYear();

    // Hide the back link.
    $( 'back' ).style.display = "none";
    // Setup event listeners for the links and Save Data button.
    $( 'back' ).addEventListener( "click", goBack, false );
    $( 'load'  ).addEventListener( "click", loadData, false );
    $( 'save'   ).addEventListener( "click", storeData, false );
    $( 'clear' ).addEventListener( "click", clearData, false );
});