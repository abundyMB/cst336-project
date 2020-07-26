
$(document).ready(function(){
    //global variables
    var albumsArray = []; //the array is now populated from the database using populateAlbumArray();
    
    //API call using Ajax to populate albums array from database. Uses app.get("/api/populateAlbumsArray") route in App.js
    populateAlbumArray();
    function populateAlbumArray(){
        
        $.ajax({
            method: "GET",
            url: "/api/populateAlbumsArray",
            type: "JSON",
            
            success: function(data, status){
                console.log("Status is " + status);

                data.forEach(function(elem, i){
                  albumObject = { albumID: elem.albumID, title: elem.title, artist: elem.artist, coverImage: elem.coverImage, price: elem.price};
                  albumsArray[i] = albumObject;
                });
            }
        });//ajax
    
    }//populateAlbumArray()
    
    var customerCart = [1];
    // localStorage.setItem("customerCart", customerCart);
    
    //function to find albums by name or artist and display them to user
    $("#albumSearch").on("change", function(){
       
      let searchValue = $("#albumSearch").val().toLowerCase();
      let itemFound = false; 
      let albumIDNum = 0;
    
       //search albums and display results
       for (let i = 0; i < albumsArray.length; i++)
       {
         titleBoolean = albumsArray[i].title.toLowerCase().includes(searchValue);
         artistBoolean = albumsArray[i].artist.toLowerCase().includes(searchValue);
         
         if ( titleBoolean || artistBoolean ) {
             $("#searchResult").html(`${albumsArray[i].coverImage} <br />`);
             $("#searchResult").append(`<strong> Artist: </strong> ${albumsArray[i].artist} <strong> Album: </strong> <i> ${albumsArray[i].title} </i> <strong> <br /> Price: </strong> $${albumsArray[i].price} <br /> <br />`);
             $("#searchResult").append(`<button  id="addToCart" value=${albumsArray[i].albumID} class="btn btn-outline-secondary"> Add to Cart </button>`);
             albumIDNum = albumsArray[i].albumID;
             console.log(albumIDNum);
             console.log("Test");
             itemFound = true;
          }
       }//close for
       
       if (!itemFound) {
          $("#searchResult").html("<p> No results found ... </p>");
       }
    });//close album search 
        
    //function to add item to cart when Add button is clicked
    $("#searchResult").on("click", "#addToCart", function(){
        
       let value = $("#addToCart").val();
       customerCart.push(value);
       console.log(customerCart);
    });
});//document ready