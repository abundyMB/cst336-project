$(document).ready(function() {
    
    // Clear any prior error messages.
    
    
    // Form submit action.
    $("#signup-form").on("submit", function() {
           
        // Check that values are valid. 
        if ($("#signup-name").val() == "") {
            event.preventDefault();
        }
        else if(!isNewUser()) {
            event.preventDefault();
        }
        else if(!isValidPassword()) {
            event.preventDefault();
        }
        else if(!passwordsMatch()) {
            event.preventDefault();
        }
        else {
            // Submit data.
        }
    });
});

// Determine that the username entered is not already in use.
function isNewUser() {
    
    // Make sure username is not empty.
    return true;
}

// Makes sure the password is valid. 
// (Ex: at least 6 chars, must have num/both upper- and lower-case).
function isValidPassword() {
    
    return true;
}

// Makes sure that the password and reentered password match.
function passwordsMatch() {
    
    return true;
}