$(document).ready(function(){

    //global variables
        
    var albumsArray = [ {albumID:0, title:"Abbey Road", artist:"The Beatles", coverImage: '<img src="/img/abbeyroad.jpg" alt="Abbey Road - Beatles">', price:25.00}, 
    {albumID:1, title:"Let There Be Cello", artist:"2 Cellos", coverImage: '<img src="/img/2cellos1.jpg" alt="Let There Be Cello - 2 Cellos">',  price:25.00},
    {albumID:2, title:"Rubber Soul", artist:"The Beatles", coverImage: '<img src="/img/rubbersoul.jpg" alt="Rubber Soul - Beatles">',  price:25.00},
    {albumID:3, title:"Extraterrestrial Live", artist:"Blue Öyster Cult", coverImage: '<img src="/img/etilive.jpg" alt="Extraterrestrial Live - Blue Öyster Cult">', price:25.00},
    {albumID:4, title:"Fire of Unknown Origin", artist:"Blue Öyster Cult", coverImage: '<img src="/img/fireofunknownorigin.jpg" alt="Fire of Unknown Origin - Blue Öyster Cult">', price:25.00},
    {albumID:5, title:"Dead Man's Party", artist:"Oingo Boingo", coverImage: '<img src="/img/deadmansparty.jpg" alt="Dead Man\'s Party - Oingo Boingo">', price:25.00},
    {albumID:6, title:"Only a Lad", artist:"Oingo Boingo", coverImage: '<img src="/img/onlyalad.jpg" alt="Only a Lad - Oingo Boingo">', price:25.00},
    {albumID:7, title:"Master of Puppets", artist:"Metallica", coverImage: '<img src="/img/masterofpuppets.jpg" alt="Master of Puppets - Metallica">', price:25.00},
    {albumID:8, title:"Dark Side of the Moon", artist:"Pink Floyd", coverImage: '<img src="/img/darksideofthemoon.jpg" alt="Dark Side of the Moon - Pink Floyd">', price:25.00},
    {albumID:9, title:"Kind of Blue", artist:"Miles Davis", coverImage: '<img src="/img/kindofblue.jpg" alt="Kind of Blue - Miles Davis">', price:25.00},
    {albumID:10, title:"Come Fly with Me", artist:"Frank Sinatra", coverImage: '<img src="/img/comeflywithme.jpg" alt="Come Fly with Me - Frank Sinatra">', price:25.00},
    {albumID:11, title:"Queen of Soul", artist:"Etta James", coverImage: '<img src="/img/queenofsoul.jpg" alt="Queen of Soul - Etta James">', price:25.00},
    {albumID:12, title:"Blues on Top of Blues", artist:"BB King", coverImage: '<img src="/img/bluesontopofblues.jpg" alt="Blues on Top of Blues - BB King">', price:25.00},
    {albumID:13, title:"The Emancipation of Mimi", artist:"Mariah Carey", coverImage: '<img src="/img/Mariah_Carey_The_Emancipation_of_Mimi.jpg" alt="The Emancipation of Mimi - Mariah Carey">', price:25.00},
    {albumID:14, title:"Merry Christmas", artist:"Mariah Carey", coverImage: '<img src="/img/Merry_Christmas_Mariah_Carey.jpg" alt="Merry Christmas - Mariah Carey">', price:25.00},
    {albumID:15, title:"Trilogy", artist:"The Weeknd", coverImage: '<img src="/img/The_Weeknd_Trilogy.jpg" alt="Trilogy -The Weeknd">', price:25.00},
    {albumID:16, title:"21", artist:"Adele", coverImage: '<img src="/img/Adele_21.jpg" alt="21 - Adele">', price:25.00},
    {albumID:17, title:"Unorthodox Jukebox", artist:"Bruno Mars", coverImage: '<img src="/img/BrunoMarsUJAlbumCover.jpg" alt="Unorthodox Jukebox - Bruno Mars">', price:25.00},
    {albumID:18, title:"I Used to Know Her", artist:"H.E.R.", coverImage: '<img src="/img/I_Used_To_Know_Her.jpg" alt="I Used to Know Her - H.E.R.">', price:25.00},
    {albumID:19, title:"Don't Smile at Me", artist:"Billie Eilish", coverImage: '<img src="/img/Billie_Eilish_Dont_Smile_at_Me.jpg" alt="Dont Smile at Me - Billie Eilish">', price:25.00}
    ];
    
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