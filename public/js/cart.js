$(document).ready(function(){
    
    //global variables
    var itemsPrice = 0.00;
    var tax = 0;
    var total = 0;
    
    var cartIDs = [];
    var albumsArray = [];
    var customerCart = [];
    
    //API call to get cart albumIDs added in search.ejs
    getCart();
    function getCart(){
        
        $.ajax({
            method: "GET",
            url: "/api/getCart",
            async: false,
            
            success: function(data, status){
                let string = JSON.stringify(data);
        
                // Clean stringified JSON data.
                let cleanString = "";
                let lastCharNumber = false;
                for (let i = 0; i < string.length; i++) {
                    // Extract only the albumIDs.
                    if (!isNaN(string.charAt(i)) && string.charAt(i) != " ") {
                        cleanString += string.charAt(i);
                        lastCharNumber = true;
                    }
                    // Only add comma if last char was a number and curr is NaN.
                    else {
                        if (lastCharNumber) {
                            cleanString += ",";
                        }
                        lastCharNumber = false;
                    }
                }
                
                // Remove final comma.
                if (cleanString.charAt(cleanString.length - 1) === ",")
                    cleanString = cleanString.slice(0, -1);
                
                // Convert cleaned string into array. Push values into global array.
                let cleanArr = cleanString.split(",");
                for (let i = 0; i < cleanArr.length; i++){
                    cartIDs.push(Number(cleanArr[i]));
                    console.log("ID: " + cartIDs[i]);
                }
            }//success
        });//ajax
    }//getCart()
    
    //API call using Ajax to populate albums array from database. Uses app.get("/api/populateAlbumsArray") route in app.js
    populateAlbumArray();
    function populateAlbumArray(){
        $.ajax({
            method: "GET",
            url: "/api/populateAlbumsArray",
            type: "JSON",
            async: false,
            
            success: function(data, status){
                data.forEach(function(elem, i){
                  albumsArray[i] = {albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price};
                });
            } 
        });//ajax
    }//populateAlbumArray()
    
    //populate customerCart based on album IDs added to cart in index.ejs and stored in localStorage
    populateCart();
    function populateCart(){
        for (let i = 0; i < cartIDs.length; i++) {
            for (let j = 0; i < albumsArray.length; j++) {
                if (albumsArray[j].albumID == cartIDs[i]) {
                    customerCart.push(albumsArray[j]);
                    break;
                }
            }
        }
    }//populateCart

    //update cart
    updateCart();
    function updateCart() {
        
        // Clear contents of cart.
        $("#cartList").html("");
        
        // Display albums and Remove buttons.
        customerCart.forEach(function(element, i){
            $("#cartList").append(`${element.coverImage} <br /> Artist: ${element.artist} Title: ${element.title} Price: $${element.price} <br />`);   
            $("#cartList").append(`<button value=${i} type="button" class="btn btn-warning remove"> Remove Item </button> <br /> <br />`);
        });
        
        // Update total of all displayed elements.
        calculateTotals();
    } //update cart
    
    //function to calculate and display cart price totals
    function calculateTotals(){
        
        itemsPrice = 0.00;
        tax = 0;
        total = 0;
    
        //iterate through customer cart and add price of each element in cart
        customerCart.forEach(function(element){    
            itemsPrice = itemsPrice += element.price;
        });
            
        tax = Math.round((itemsPrice * 0.06), 2);
        total = Math.round((itemsPrice + tax), 2);
        
        $("#itemsTotal").html(`Items: $${itemsPrice}`);
        $("#taxTotal").html(`Tax: $${tax}`);
        $("#orderTotal").html(`Total Price: $${total}`);
    }//calculate totals
    
    //add function to remove items from cart
    $("#cartList").on("click",".remove", function() {
        let itemID = $(this).val();
        removeAlbum(customerCart[itemID].albumID);
        
        // Update cart with new display and totals.
        updateCart();
    });//remove items from cart
    
    $("#placeOrder").on("click", function(event){
        let albumIDs = "";
        let albumTitles ="";
        let cartEmpty = true;
        
        customerCart.forEach(function(elem){
           if (elem != null) {
            cartEmpty = false; 
           }
        });
        
        if (cartEmpty) {
            $('#cartError').html('<p class="text-danger"> There are no items in your cart. </p>');
            event.preventDefault();
        }
        else {
            //build strings of albumIDs and albumTitles
            customerCart.forEach(function(elem) {
                albumIDs += elem.albumID + ",";
                albumTitles += elem.title + ",";
                
                $("#summary").hide();
                $("#hr1").hide();
                $("#hr2").hide();
                $("#placeOrder").hide();
                $("#itemsTotal").hide();
                $("#taxTotal").hide();
                $("#orderTotal").hide();
                
                $('#cartError').html('<p class="text-success" style="font-size: 1.5em"> ♫ <strong> Thanks for your Order </strong> ♫ </p> ');
                $('#cartError').append('<p> <i> Check your email for a digital download link! </i> </p>');
                $('#cartError').append('<p> <strong> Order Details: </strong> </p> <hr />');

                customerCart.forEach(function(elem){
                $('#cartError').append(`<p>"${elem.title}" — $${elem.price}`);
                });
                $('#cartError').append(`<p> <strong> Total Price: </strong> $${total} </p> <hr />`);
                
            });
            
            submitOrder(albumIDs, albumTitles, total);
        }
    });
    
     //api call to /api/submitOrder when Submit Order button is clicked
    function submitOrder(albumIDs, albumTitles, orderTotal){
       $.ajax({
           method: "GET",
           url: "/api/submitOrder",
           data: {
               "albumIDs": albumIDs,
               "albumTitles": albumTitles,
               "orderTotal": orderTotal
           },
           
           success: function(data, status){
               console.log("Submit order returned: " + data);
           }
       });//ajax
    }
    
    function removeAlbum(removeAlbumID) {
    
        // Stringify cardIDs array to match albumIDs format in database.
        let cartIDsString = "";
        let removedAlbumIndex = -1;
        // Add all cartIDs except one to be removed.
        for (let i = 0; i < cartIDs.length; i++) {
            if (removeAlbumID != cartIDs[i]) {
                cartIDsString += cartIDs[i];
            }
            // Store cartID with removed value to delete from array.
            else {
                removedAlbumIndex = i;
            }
            cartIDsString += " "; 
        }
        
        // Delete related records.
        delete customerCart[removedAlbumIndex];
        delete cartIDs[removedAlbumIndex];
        
        // Update cart database with current cart contents.
        setCart(cartIDsString, 0);
    }
    
    //API call to set customer cart in database once add to cart button is clicked
   function setCart(albumIDs, customerID) {
      $.ajax({
         method: "GET",
         url: "/api/setCart",
         data: {
            "albumIDs": albumIDs,
            "customerID": customerID
         },

         success: function(data, status) {
         }
      }); //ajax
   } //setCart()
});//document ready
    