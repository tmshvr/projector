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
        var radios = document.forms[ 0 ].ctype, i, comboBox;
        for( i=0; i < radios.length; i++ ) {
            if( radios[ i ].checked === true ) {
                cTypeValue = radios[ i ].value;
            };
        };
        comboBox = $( "filetype" );
        filetypeValue = comboBox.options[ comboBox.selectedIndex ].value;
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

    function autoFillData() {
        // Load data from the json object in json.js and lod it into localStorage.
        for( var n in json ) {
            var id = json[ n ].project[ 1 ] + "_" + json[ n ].filename[ 1 ];
            localStorage.setItem( id, JSON.stringify( json[ n ]));
        };
    };

    function getImage( makeSubList, catName ) {
        var imgLi = document.createElement( "li" );
        makeSubList.appendChild( imgLi );
        var newImg = document.createElement( "img" );
        newImg.setAttribute( "src", "images/" + catName.toLowerCase() + "Icon.png" );
        newImg.setAttribute( "width", "80px" );
        newImg.setAttribute( "height", "auto" );
        imgLi.appendChild( newImg );
    };

    function loadData() {
        var dA = $( "displayArea" ),
            makeDiv, makeList, makeLi, key, value, obj, makeSubList, makeSubLi, optSubText, len, i, n;
        if( dA ) {
            dA.parentNode.removeChild( dA );
        };
        if( localStorage.length === 0 ) {
            autoFillData();
            alert( "The localStorage object was empty; it has been filled with default data." );
        };
        resetErrors();
        makeDiv = document.createElement( "div" );
        makeDiv.setAttribute( "id", "displayArea" );
        makeList = document.createElement( "ul" );
        makeDiv.appendChild( makeList );
        document.body.appendChild( makeDiv );
        for( i = 0, len = localStorage.length; i < len; i++ ) {
            makeLi = document.createElement( "li" );
            makeList.appendChild( makeLi );
            linksLi = document.createElement( "ul" );
            key = localStorage.key( i );
            value = localStorage.getItem( key );
            obj = JSON.parse( value );
            makeSubList = document.createElement( "ul" );
            makeSubList.setAttribute( "class", "listing" );
            makeSubList.appendChild( linksLi );
            makeLi.appendChild( makeSubList );

            getImage( makeSubList, obj.filetype[ 1 ]);

            for( n in obj ) {
                makeSubLi = document.createElement( "li" );
                makeSubLi.setAttribute( "class", "item" );
                makeSubList.appendChild( makeSubLi );
                optSubText = toTitleCase( obj[ n ][ 0 ] ) + ": " + obj[ n ][ 1 ];
                makeSubLi.innerHTML = optSubText;
            };
            makeItemLinks( localStorage.key(i), linksLi );
        };
        $( "formarea" ).style.display = "none";
        $( "load" ).style.display = "none";
        $( "back" ).style.display = "";
    };

    // Store form data in localStorage.
    function storeData( key ) {
        var item = {}, id, isValid;
        if( ! key ) { // If there is no key, make one.
            id = $( "project" ).value + "_" + $( "filename" ).value;
        }
        else {
            // This item is being edited, and will be saved with the key passed in from validate.
            id = key;
        };
        getDynamicItems();
        item.project = [ "project", $( "project" ).value ];
        item.filename = [ "filename", $( "filename" ).value ];
        item.author = [ "author", $( "author" ).value ];
        item.description = [ "description", $( "description" ).value ];
        item.ctype = [ "ctype", cTypeValue ];
        item.filetype = [ "filetype", filetypeValue ];
        item.due = [ "due", $( "due" ).value ];
        item.priority = [ "priority", $( "priority" ).value ];
        item.created = [ "created", $( "created" ).value ];
        localStorage[ id ] = JSON.stringify( item );
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

        // Insert a break between the links so they won't be side-by-side.
        var breakTag = document.createElement( "br" );
        linksLi.appendChild( breakTag );

        // Create a control to delete an item from the localStorage list.
        var deleteLink = document.createElement( "a" );
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete File";
        deleteLink.addEventListener( "click", deleteItem );
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild( deleteLink );
    };

    function editItem() {
        var value = localStorage.getItem( this.key ); // The .key value from the editLink that was clicked.
        var item = JSON.parse( value );
        // Show the form
        toggleControls( "on" );

        // Populate the form fields with data from localStorage.
        $( "project" ).value = item.project[ 1 ];
        $( "filename" ).value = item.filename[ 1 ];
        $( "author" ).value = item.author[ 1 ];
        $( "description" ).value = item.description[ 1 ];
        $( item.ctype[ 1 ]).checked = true;
        for( var i = 0, j = $( "filetype" ).options.length; i < j; i++ ) {
            if( $( "filetype" ).options[ i ].value === item.filetype[ 1 ] ) {
                $( "filetype" ).selectedIndex = i;
                break;
            };
        };
        $( "due" ).value = item.due[ 1 ];
        $( "priority" ).value = item.priority[ 1 ];
        $( "created" ).value = item.created[ 1 ];

        // Change submit button value to Edit File.
        $( "save" ).value = "Save";
        var editSubmit = $( "save" );
        // Save the key est. in this function as a property of the submit button.
        editSubmit.key = this.key;
    };

    function deleteItem() {
        var ask = confirm( "Are you sure?" );
        if( ask ) {
            alert( "Deleting " + this.key + "." );
            localStorage.removeItem( this.key );
        }
        else {
            alert( this.key + " was not deleted." );
        };
    };

    function validate() {
        // Get the values of ctype and filetype 
        // Define the elements we ewant to change.
        var valid,
            messageAry = [],
            // Define the elements we want to validate.
            getProject = $( "project" ),
            getFilename = $( "filename" ),
            getAuthor = $( "author" ),
            getDescription = $( "description" ),
            getCType,
            getFiletype = $( "filetype" ).options[ $( "filetype" ).selectedIndex ].value,
            getDue = $( "due" ),
            getPriority = $( "priority" ),
            // Make sure 
            getDateDifference = dateDifference( getDue.value, $( "created" ).value ),
            radios = document.forms[ 0 ].ctype;
        // Get the selected value for ctype:
        for( var i = 0, j = radios.length; i < j; i++ ) {
            if( radios[ i ].checked === true ) {
                getCType = radios[ i ];
            };
        };

        // Reset the error messages, and form field borders.
         resetErrors();

        // Validate the elements.
        // Make sure we don't save a project_filename key that will overwrite another, unless we're editing.
        if( $( "save" ).value !== "Save" ) {
            if( localStorage.getItem( getProject.value + "_" + getFilename.value )) {
                getFilename.style.border = "1px solid red";
                messageAry.push( getFilename.value + " already exists in " + getProject.value );
            };
        };
        if( getProject.value === "" || getProject.value === undefined ) {
            getProject.style.border = "1px solid red";
            messageAry.push( "Provide a project name." );
        };
        if( getFilename.value === "" || getFilename.value === undefined ) {
            getFilename.style.border = "1px solid red";
            messageAry.push( "Provide a file name." );
        };
        if( getAuthor.value === "" || getAuthor.value === undefined ) {
            getAuthor.style.border = "1px solid red";
            messageAry.push( "Provide an author." );
        };
        if( getDescription.value === "" || getDescription.value === undefined ) {
            getDescription.style.border = "1px solid red";
            messageAry.push( "Provide a description of the file." );
        };
        if( getCType.value === "client" && ( getFiletype === "PHP" || getFiletype === "MySQL" || getFiletype === "Audio" || getFiletype === "Video" || getFiletype === "Graphic" )) {
            $( "filetype" ).style.border = "1px solid red";
            messageAry.push( "Client code file type must be HTML, CSS, or JavaScript." );
        };
        if( getCType.value === "server" && ( getFiletype === "HTML" || getFiletype === "CSS" || getFiletype === "JavaScript" || getFiletype === "Audio" || getFiletype === "Video" || getFiletype === "Graphic" )) {
            $( "filetype" ).style.border = "1px solid red";
            messageAry.push( "Server code file type must be PHP or MySQL." );
        };
        if( getCType.value === "media" && ( getFiletype === "HTML" || getFiletype === "CSS" || getFiletype === "JavaScript" || getFiletype === "PHP" || getFiletype === "MySQL" )) {
            $( "filetype" ).style.border = "1px solid red";
            messageAry.push( "Media file type must be Audio, Video, or Graphic." );
        };
        if( getDue.value === "" || getDue.value === undefined ) {
            getDue.style.border = "1px solid red";
            messageAry.push( "Provide a due date for the file." );
        };
        if( getDateDifference[ 0 ] < 0 || getDateDifference[ 1 ] < 0 ||
            getDateDifference[ 0 ] === undefined || getDateDifference[ 1 ] === undefined ) {
            getDue.style.border = "1px solid red";
            messageAry.push( "Due date must be after start date" );
        };
        // If there were errors, display them on-screen.
        if( messageAry.length > 0 ) {
            for( var i = 0, j = messageAry.length; i < j; i++ ) {
                var txt = document.createElement( "li" );
                txt.innerHTML = messageAry[ i ];
                errMsg.appendChild( txt );
            };
            event.preventDefault();
        }
        else { // If there are no errors, then save the data.
            // Store with the key passed to validate by the submit button, which was added to the
            // submit button when the editItem function ran.
            storeData( this.key );
        };
        event.preventDefault();
        return false;
    };

    function clearData() {
        localStorage.clear();
        alert( localStorage.length === 0 ? "Cleared localStorage." : "Something's still in localStorage." );
    };

    function toggleControls( status ) {
        switch( status ) {
            case "off":
                $( "formarea" ).style.display = "none";
                $( "load" ).style.display = "none";
                $( "back" ).style.display = "";
                break;
            case "on":
                $( "formarea" ).style.display = "";
                $( "load" ).style.display = "";
                $( "back" ).style.display = "none";
                var dA = $( "displayArea" );
                if( dA ) {
                    dA.parentNode.removeChild( dA );
                };
                break;
        };
    };

    function resetErrors() {
        // Reset the error messages, if there are any.
        if( errMsg.innerHTML !== "" ) {
            errMsg.innerHTML = "";
            $( "project" ).style.border = "1px solid black";
            $( "filename" ).style.border = "1px solid black";
            $( "author" ).style.border = "1px solid black";
            $( "description" ).style.border = "1px solid black";
            $( "filetype" ).style.border = "1px solid black";
            $( "due" ).style.border = "1px solid black";
            $( "priority" ).style.border = "1px solid black";
        };
    };

    function goBack() {
        toggleControls( "on" );
    };

    function initStorage() { // Hack for bug in Chrome/Safari:
        if( localStorage.length === 0 ) { // If localStorage is empty, it's un-initialized and won't be accessible,
            localStorage.clear(); // but if we clear it while it's non-existent, it will be created.
        };
    };

    // Global variables.
    var fileTypes = [ "HTML", "CSS", "JavaScript", "PHP", "MySQL", "Audio", "Video", "Graphic" ],
        cTypeValue,
        filetypeValue,
        started = new Date(),
        errMsg = $( "errors" );

    // Create the combobox/select element.
    makeComboBox( "typeLabel", fileTypes, "filetype" );

    // Let the hack do it's work.
    initStorage();

    // Initialize the due and created dates.
    $( "due" ).value = ( started.getMonth() + 2 ) + "/" + started.getDate() + "/" + started.getFullYear();
    $( "created" ).value = ( started.getMonth() + 1 ) + "/" + started.getDate() + "/" + started.getFullYear();

    // Hide the back link.
    $( "back" ).style.display = "none";
    // Setup event listeners for the links and Save Data button.
    $( "back" ).addEventListener( "click", goBack );
    $( "load" ).addEventListener( "click", loadData );
    $( "save" ).addEventListener( "click", validate );
    $( "clear" ).addEventListener( "click", clearData );
});