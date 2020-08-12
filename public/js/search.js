$(document).ready(function() {
   //global variables
   var albumsArray = []; //the array is now populated from the database using populateAlbumArray();
   var filteredAlbumsArray = []; //populated after a filtering parameter is entered in textboxes
   var albumIDsString = "";
   $("#checkboxContainer").hide();

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
               albumsArray[i] = { albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price, genre: elem.genre };
               
            });
         }
      }); //ajax
   } //populateAlbumArray()

   //API call to get cart albumIDs added in search.ejs
   function getCart() {
      $.ajax({
         method: "GET",
         url: "/api/getCart",
         async: false,

         success: function(data, status) {
            
            console.log("getCart: " + data);
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
         } //success
      }); //ajax
   } //getCart()

   //API call to set customer cart in database once add to cart button is clicked
   function setCart(albumIDs, customerID) {
      $.ajax({
         method: "GET",
         url: "/api/setCart",
         data: {
            "albumIDs": albumIDs,
            "customerID": customerID
         },

         success: function(data, status) {}
      }); //ajax
   } //setCart()

   //function to find albums by name or artist and display them to user
   $("#albumSearch").on("change", function() {
      $("#searchResult").html("");
      let searchValue = $("#albumSearch").val().toLowerCase();

      ($("#priceSearch").val() == "") ? showSearchResults(searchValue, false): showSearchResults(searchValue, true);
   });

   $("#priceSearch").on("change", function() {
      $("#searchResult").html("");
      let priceValue = $("#priceSearch").val();

      ($("#albumSearch").val() == "") ? showSearchResults(priceValue, false): showSearchResults(priceValue, true);
   });

   //shows search results based on search by title/genre/artist or price 
   function showSearchResults(searchParam, filteredBoolean) {

      let itemFound = false;
      let rows = "";
      let counter = 1;
      console.dir(albumsArray);
      $("#checkboxContainer").show();

      if (!filteredBoolean) {
         //search albums and display results
         filteredAlbumsArray = []; //reset filtered albums array

         for (let i = 0; i < albumsArray.length; i++) {
            let titleBoolean = albumsArray[i].title.toLowerCase().includes(searchParam);
            let artistBoolean = albumsArray[i].artist.toLowerCase().includes(searchParam);
            let genreBoolean = (albumsArray[i].genre == searchParam);

            if (titleBoolean || artistBoolean || genreBoolean || (albumsArray[i].price <= searchParam) || searchParam == "all") {
               filteredAlbumsArray.push(albumsArray[i]);

               var newRow = `<div class="row">`;
               var column = `<div class="col"> <div class="card"> <div class="card-body"> ${albumsArray[i].coverImage} <br /> <strong> Artist: </strong> ${albumsArray[i].artist} <strong> Album: </strong> <i> ${albumsArray[i].title} </i> <strong> <br /> Price: </strong> $${albumsArray[i].price} <br /> <button value=${albumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> </div> </div></div>`;
               var closeRow = `</div>`;

               (counter == 1 || ((counter - 1) % 3 == 0 && counter != 1)) ? rows += newRow: "";
               rows += column;
               (counter == 3 || (counter % 3 == 0) || i == albumsArray.length - 1) ? rows += closeRow: "";

               counter++;
               itemFound = true;
            }
         }
         //print string of HTML
         $("#searchResult").append(rows);
      } //close non-filtered array search

      else if (filteredBoolean) {
         //search albums and display results
         for (let i = 0; i < filteredAlbumsArray.length; i++) {
            let titleBoolean = filteredAlbumsArray[i].title.toLowerCase().includes(searchParam);
            let artistBoolean = filteredAlbumsArray[i].artist.toLowerCase().includes(searchParam);
            let genreBoolean = (filteredAlbumsArray[i].genre == searchParam);

            if (titleBoolean || artistBoolean || genreBoolean || (filteredAlbumsArray[i].price <= searchParam)) {

               var newRow = `<div class="row">`;
               var column = `<div class="col"> <div class="card"> <div class="card-body"> ${filteredAlbumsArray[i].coverImage} <br /> <strong> Artist: </strong> ${filteredAlbumsArray[i].artist} <strong> Album: </strong> <i> ${filteredAlbumsArray[i].title} </i> <strong> <br /> Price: </strong> $${filteredAlbumsArray[i].price} <br /> <button value=${filteredAlbumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> </div> </div></div>`;
               var closeRow = `</div>`;

               (counter == 1 || ((counter - 1) % 3 == 0 && counter != 1)) ? rows += newRow: "";
               rows += column;
               (counter == 3 || (counter % 3 == 0) || i == filteredAlbumsArray.length - 1) ? rows += closeRow: "";

               counter++;
               itemFound = true;
            }
         }
         //print string of HTML 
         $("#searchResult").append(rows);
      } //close filtered array search

      if (!itemFound) {
         $("#searchResult").html("<p> No results found ... </p>");
      }
   } //close showSearchResults()

   //function to add item to cart when Add button is clicked
   $("#searchResult").on("click", ".btn-outline-secondary", function() {

      let value = $(this).val();
      $(this).html("Album Added!");
      albumIDsString += " ";
      albumIDsString += value;

      setCart(albumIDsString, 0);
   });

   //function to apply genre checkbox filters 
   $(".checkBox").on("click", function() {
      $("#searchResult").html("");
      let allUnchecked = true;

      $(".checkBox").each(function() {
         let checkboxValue = $(this).val();
         let isChecked = this.checked;

         isChecked ? showSearchResults(checkboxValue, true) : "";
         isChecked ? allUnchecked = false : "";
      });
      allUnchecked ? (showSearchResults("all", false)) : "";
   }); //onClick()

}); //document ready
