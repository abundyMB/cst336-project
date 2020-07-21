$(document).ready(function(){

//global variables
    
var albumsArray = [ {albumID:0, title:"Abbey Road", artist:"The Beatles", coverImage: '<img src="/img/abbeyroad.jpg" alt="Abbey Road - Beatles">', price:25.00}, 
{albumID:1, title:"Let There Be Cello", artist:"2 Cellos", coverImage: '<img src="/img/2cellos1.jpg" alt="Let There Be Cello - 2 Cellos">',  price:25.00},
{albumID:2, title:"Rubber Soul", artist:"The Beatles", coverImage: '<img src="/img/rubbersoul.jpg" alt="Rubber Soul - Beatles">',  price:25.00}

];

var customerCart = [1];
localStorage.setItem("customerCart", customerCart);

//function to find albums by name or artist and display them to user
$("#albumSearch").on("change", function(){
   
  let searchValue = $("#albumSearch").val().toLowerCase();
  let itemFound = false; 
  let albumIDNum = 0;

   //search albums and display results
   for (let i = 0; i < 3; i++)
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

