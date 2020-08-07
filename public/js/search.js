$(document).ready(function() {
   //global variables
   var albumsArray = []; //the array is now populated from the database using populateAlbumArray();
   var albumIDsString = "";

   //API call using Ajax to populate albums array from database. Uses app.get("/api/populateAlbumsArray") route in App.js
   populateAlbumArray();
   
   // Get contents of current cart.
   getCart();

   function populateAlbumArray() {
      $.ajax({
         method: "GET",
         url: "/api/populateAlbumsArray",
         type: "JSON",
         async: false,

         success: function(data, status) {

            data.forEach(function(elem, i) {
               albumsArray[i] = { albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price };
            });
         }
      }); //ajax
   } //populateAlbumArray()
   
    //API call to get cart albumIDs added in search.ejs
    function getCart(){
        $.ajax({
            method: "GET",
            url: "/api/getCart",
            async: false,
            
            success: function(data, status){
                let string = JSON.stringify(data);
                let newString = string.replace('[{"albumIDs":"', "").replace(' "}]', "").split(' ').toString();
                
                // Add cleaned string to global album IDs string.
                let lastCharNumber = false;
                for (let i = 0; i < newString.length; i++) {
                    if (!isNaN(newString.charAt(i)) && newString.charAt(i) != " ") {
                        albumIDsString += newString.charAt(i);
                        lastCharNumber = true;
                    }
                    else {
                        if (lastCharNumber) {
                            albumIDsString += " ";
                        }
                        
                        lastCharNumber = false;
                    }
                }
                   
                console.log("Album string: " + albumIDsString);
            }//success
        });//ajax
    }//getCart()

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
            console.log("Data from setCart" + data + "Status" + status);
         }
      }); //ajax
   } //setCart()

   //function to find albums by name or artist and display them to user
   $("#albumSearch").on("change", function() {
      let searchValue = $("#albumSearch").val().toLowerCase();
      showSearchResults(searchValue);
   });

   $("#priceSearch").on("change", function() {
      let priceValue = $("#priceSearch").val();
      showSearchResults(priceValue)
   });

   //shows search results based on search by title/genre/artist or price 
   function showSearchResults(searchParam) {
      $("#searchResult").html("");

      let itemFound = false;
      console.dir(albumsArray);
      //search albums and display results
      for (let i = 0; i < albumsArray.length; i++) {
         let titleBoolean = albumsArray[i].title.toLowerCase().includes(searchParam);
         let artistBoolean = albumsArray[i].artist.toLowerCase().includes(searchParam);

         if (titleBoolean || artistBoolean || (albumsArray[i].price <= searchParam)) {
            $("#searchResult").append(`${albumsArray[i].coverImage} <br />`);
            $("#searchResult").append(`<strong> Artist: </strong> ${albumsArray[i].artist} <strong> Album: </strong> <i> ${albumsArray[i].title} </i> <strong> <br /> Price: </strong> $${albumsArray[i].price} <br /> <br />`);
            $("#searchResult").append(`<button value=${albumsArray[i].albumID} class="btn btn-outline-secondary"> Add to Cart </button> <br />`);
            itemFound = true;
         }
      } //close for

      if (!itemFound) {
         $("#searchResult").html("<p> No results found ... </p>");
      }
   } //close showSearchResults()

   //function to add item to cart when Add button is clicked
   $("#searchResult").on("click", ".btn-outline-secondary", function() {

      let value = $(this).val();
      albumIDsString += " ";
      albumIDsString += value;
      
      setCart(albumIDsString, 0);
   });

}); //document ready