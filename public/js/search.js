$(document).ready(function() {
   //global variables
   var albumsArray = []; //the array is now populated from the database using populateAlbumArray();
   var filteredAlbumsArray = []; //populated after a filtering parameter is entered in textboxes
   var albumIDsString = "";
   $("#checkboxContainer").hide();
   $("#column1").hide();
   $("#column2").hide();
   $("#column3").hide();

   //API call using Ajax to populate albums array from database. Uses app.get("/api/populateAlbumsArray") route in App.js
   populateAlbumArray();
   
   // Get contents of current cart.
   getCart();
   
   displayRandomAlbum();
   function displayRandomAlbum() {
      let randomAlbum = Math.floor(Math.random() * 20) + 1;  
      
      $.ajax({
         method: "GET",
         url: "/api/retrieveAlbumDetails",
         data: {
            "albumID": randomAlbum
         },

         success: function(data, status) {
            data.forEach(function(elem, i) {
               console.log("Album data is:" + data);
               filteredAlbumsArray[i] = { albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price, genre: elem.genre};
               displayAlbums();
            });
         }
      }); //ajax
   }

   function populateAlbumArray() {
      $.ajax({
         method: "GET",
         url: "/api/populateAlbumsArray",
         type: "JSON",
         async: false,

         success: function(data, status) {

            data.forEach(function(elem, i) {
               console.log("Album data is:" + data);
               albumsArray[i] = { albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price, genre: elem.genre};
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
      $("#searchResult").html("");
      let searchValue = $("#albumSearch").val().toLowerCase();
      
      ($("#priceSearch").val() == "") ? showSearchResults(searchValue, false) : showSearchResults(searchValue, true);
   });

   $("#priceSearch").on("change", function() {
       $("#searchResult").html("");
      let priceValue = $("#priceSearch").val();
      
      ($("#albumSearch").val() == "") ? showSearchResults(priceValue, false) : showSearchResults(priceValue, true);
   });

   
   //shows search results based on search by title/genre/artist or price 
   function showSearchResults(searchParam, filteredBoolean) {

      let itemFound = false;
      console.dir(albumsArray);
      $("#checkboxContainer").show();
      
      if (!filteredBoolean) {
         //search albums and display results
         filteredAlbumsArray = [];//reset filtered albums array
         
         for (let i = 0; i < albumsArray.length; i++) {
            let titleBoolean = albumsArray[i].title.toLowerCase().includes(searchParam);
            let artistBoolean = albumsArray[i].artist.toLowerCase().includes(searchParam);
            let genreBoolean = (albumsArray[i].genre == searchParam);
   
            if (titleBoolean || artistBoolean || genreBoolean || (albumsArray[i].price <= searchParam) || searchParam == "all") {
               filteredAlbumsArray.push(albumsArray[i]);
               
               // $("#searchResult").append(`${albumsArray[i].coverImage} <br />`);
               // $("#searchResult").append(`<strong> Artist: </strong> ${albumsArray[i].artist} <strong> Album: </strong> <i> ${albumsArray[i].title} </i> <strong> <br /> Price: </strong> $${albumsArray[i].price} <br />`);
               // $("#searchResult").append(`<button value=${albumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> <br /> <br />`);
              
               itemFound = true;
            }
          } 
      }//close non-filtered array search
      
      else if (filteredBoolean) {
         //search albums and display results
         for (let i = 0; i < filteredAlbumsArray.length; i++) {
            let titleBoolean = filteredAlbumsArray[i].title.toLowerCase().includes(searchParam);
            let artistBoolean = filteredAlbumsArray[i].artist.toLowerCase().includes(searchParam);
            let genreBoolean = (filteredAlbumsArray[i].genre == searchParam);
   
            if (titleBoolean || artistBoolean || genreBoolean || (filteredAlbumsArray[i].price <= searchParam)) {
               // $("#searchResult").append(`${filteredAlbumsArray[i].coverImage} <br />`);
               // $("#searchResult").append(`<strong> Artist: </strong> ${filteredAlbumsArray[i].artist} <strong> Album: </strong> <i> ${filteredAlbumsArray[i].title} </i> <strong> <br /> Price: </strong> $${filteredAlbumsArray[i].price} <br />`);
               // $("#searchResult").append(`<button value=${filteredAlbumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> <br /> <br />`);
               itemFound = true;
            }
          } 
      }//close filtered array search
 
      if (itemFound) {
          displayAlbums();
      }
      else {
         $("#resultsContainer").html("<p> No results found ... </p>");
      }
   } //close showSearchResults()

   //function to add item to cart when Add button is clicked
   $("#resultsContainer").on("click", ".btn-outline-secondary", function() {

      let value = $(this).val();
      $(this).html("Album Added!");
      albumIDsString += " ";
      albumIDsString += value;
      console.log( $(this).val() );
      
      setCart(albumIDsString, 0);
   });
   
   //function to apply genre checkbox filters 
      $(".checkBox").on("click", function(){
        $("#resultsContainer").html("");
        let allUnchecked = true;
         
         $(".checkBox").each(function(){
            let checkboxValue = $(this).val();
            let isChecked = this.checked; 
            
            isChecked ? showSearchResults(checkboxValue, true): "";
            isChecked ? allUnchecked = false: "";
         });
         allUnchecked ? (showSearchResults("all", false)): "";
      });//onClick()
      
      function displayAlbums() {
         console.log("Displaying albums");
         $("#column1").html("");
         $("#column2").html("");
         $("#column3").html("");
         let numFoundAlbums = filteredAlbumsArray.length;
         if (numFoundAlbums == 1) {
               $("#column1").show();
               $("#column1").append(`${filteredAlbumsArray[0].coverImage} <br />`);
               $("#column1").append(`<strong> Artist: </strong> ${filteredAlbumsArray[0].artist} <strong> Album: </strong> <i> ${filteredAlbumsArray[0].title} </i> <strong> <br /> Price: </strong> $${filteredAlbumsArray[0].price} <br />`);
               $("#column1").append(`<button value=${filteredAlbumsArray[0].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> <br /> <br />`);
         }
         else if (numFoundAlbums == 2) {
            $("#column1").show();
            $("#column1").css("float", "left");
            $("#column1").css("width", "45%");
            $("#column1").css("padding", "10px");
            
            $("#column2").show();
            $("#column2").css("float", "left");
            $("#column2").css("width", "45%");
            $("#column2").css("padding", "10px");
            
               for (let i = 0; i < filteredAlbumsArray.length; i++) {
                  let columnNum = i;
                  let columnName = "";
                  
                  if (columnNum == 0)
                     columnName = "#column1";
                  else if (columnNum == 1)
                     columnName = "#column2";
                     
                  $(columnName).append(`${filteredAlbumsArray[i].coverImage} <br />`);
                  $(columnName).append(`<strong> Artist: </strong> ${filteredAlbumsArray[i].artist} <strong> Album: </strong> <i> ${filteredAlbumsArray[i].title} </i> <strong> <br /> Price: </strong> $${filteredAlbumsArray[i].price} <br />`);
                  $(columnName).append(`<button value=${filteredAlbumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> <br /> <br />`);
            }
         }
         else if (numFoundAlbums >= 3) {
            $("#column1").show();
            $("#column1").css("float", "left");
            $("#column1").css("width", "30%");
            $("#column1").css("padding", "10px");
            
            $("#column2").show();
            $("#column2").css("float", "left");
            $("#column2").css("width", "30%");
            $("#column2").css("padding", "10px");
            
            $("#column3").show();
            $("#column3").css("float", "left");
            $("#column3").css("width", "30%");
            $("#column3").css("padding", "10px");
           
               for (let i = 0; i < filteredAlbumsArray.length; i++) {
                  let columnNum = i;
                  let columnName = "";
                  
                  if (columnNum % 3 == 0)
                     columnName = "#column1";
                  else if (columnNum % 3 == 1)
                     columnName = "#column2";
                  else if (columnNum % 3 == 2)
                     columnName = "#column3";
                     
                  $(columnName).append(`${filteredAlbumsArray[i].coverImage} <br />`);
                  $(columnName).append(`<strong> Artist: </strong> ${filteredAlbumsArray[i].artist} <strong> Album: </strong> <i> ${filteredAlbumsArray[i].title} </i> <strong> <br /> Price: </strong> $${filteredAlbumsArray[i].price} <br />`);
                  $(columnName).append(`<button value=${filteredAlbumsArray[i].albumID} class="btn btn-outline-secondary"> <strong> Add to Cart </strong> </button> <br /> <br />`);
            }
         }
      }
   
}); //document ready