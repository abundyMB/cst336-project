$(document).ready(function() {

   // Global variables
   var updateAlbumID;//this is for the update album function

   // Event listeners.

   $("#add-form").on("submit", function() {

      // $("#validationFdbk").html(""); //resets validation feedback
      // if (!isAddFormValid()) {
      //    return;
      // }

      addAlbum();
      console.log("Add Form Complete");
   });

   // Find Album to update
   $("#find-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      // if (!isFindFormValid()) {
      //    return;
      // }
      //Test form submit
      console.log("Find Album Complete");
   });

   // Update function
   $("#update-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      if (!isUpdateFormValid()) {
         return;
      }
      //Test form submit
      console.log("Update Album form complete");
   });

   // Delete function
   $("#delete-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      console.log("Form delete");
      if (!isDeleteFormValid()) {
         event.preventDefault();
      }

      console.log("Delete form");
      deleteAlbum();
   });

   $("#updateSearch").on("change", function() {

      // searchAlbum from search.js...
      let searchValue = $("#updateSearch").val().toLowerCase();
      let itemFound = false;
      let albumIDNum = 0;
      for (let i = 0; i < albumsArray.length; i++) {
         titleBoolean = albumsArray[i].title.toLowerCase().includes(searchValue);
         artistBoolean = albumsArray[i].artist.toLowerCase().includes(searchValue);

         if (titleBoolean || artistBoolean) {
            $("#updateResult").html(`${albumsArray[i].coverImage} <br />`);
            $("#updateResult").append(`<strong> Artist: </strong> ${albumsArray[i].artist} <strong> Album: </strong> <i> ${albumsArray[i].title} </i> <strong> <br /> Price: </strong> $${albumsArray[i].price} <br /> <br />`);
            // omitted, not needed-> $("#updateResult").append(`<button  id="addToCart" value=${albumsArray[i].albumID} class="btn btn-outline-secondary"> Add to Cart </button>`);
            albumIDNum = albumsArray[i].albumID;
            console.log(albumIDNum);
            console.log("Test");
            itemFound = true;
         }
      } //close for

      if (!itemFound) {
         $("#updateResult").html("<p> No results found ... </p>");
      }
   }); //close album search 

   // ...end Listener Section

   // start Functions Section

   function addAlbum() {
      let albumAddTitle = $("#add-title").val();
      let albumAddArtist = $("#add-artist").val();
      let albumAddCoverImage = $("#add-coverImage").val();
      let albumAddPrice = $("#add-price").val();
      let albumAddGenre = $("#add-genre").val();
      let albumAddTag1 = $("#add-tag1").val();
      let albumAddTag2 = $("#add-tag2").val();
      $.ajax({
         method: "get",
         url: "/api/addAlbumsArray",
         data: {
            "title": albumAddTitle,
            "artist": albumAddArtist,
            "coverImage": albumAddCoverImage,
            "price": albumAddPrice,
            "genre": albumAddGenre,
            "tag1": albumAddTag1,
            "tag2": albumAddTag2
         },
         success: function(data, status) {
            console.log("Add Album: " + data);
         }
      }); //ajax
   } //addAlbum

   function updateAlbum() {
      var update = document.getElementById('update-album').value;
      // update
      console.log("Updated albumID:" + update.value);
      update.value = " ";
   }

   function updateAlbumsArray(action, title, artist, coverImage, price, genre, tag1, tag2) {
      $.ajax({
         method: "get",
         url: "/api/updateAlbumsArray",
         data: {
            "action": action,
            "title": title,
            "artist": artist,
            "coverImage": coverImage,
            "price": price,
            "genre": genre,
            "tag1": tag1,
            "tag2": tag2
         },
         success: function(data, status) {}
      }); //ajax
   } //updateAlbum

   function deleteAlbum() {
      let albumDeleteID = $("#delete-album").val();
      console.log("Album deleteID: " + albumDeleteID);

      $.ajax({
         method: "GET",
         url: "/api/deleteAlbum",
         data: {
            "albumID": albumDeleteID
         },

         success: function(data, status) {
            console.log("Data from setCart" + data + "Status" + status);
         }
      }); //ajax
   }

   // Form Validation Section

   function isAddFormValid() { // Validate Add Form
      let isValid = true;
      if ($("#add-title").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#add-artist").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#add-coverImage").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#add-genre").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#add-price").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
   }

   function isUpdateFormValid() { // Validate Update Form
      let isValid = true;
      if ($("#update-title").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#update-artist").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#update-coverImage").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#update-genre").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      if ($("#update-price").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out all the form fields");
      }
      return isValid;
   }
   //
   function isDeleteFormValid() { // Validate Delete Form
      let isValid = true;
      if ($("#delete-album").val() == "") {
         isValid = false;
         $("#validationFdbk").html("Fill out the ID field");
      }
      return isValid;
   }
   
   //retrieve album data after albumID is entered 
   $("#updateAlbum").on("change", function(){
      updateAlbumID = $(this).val(); 
      $.ajax({
         method: "GET",
         url: "/api/retrieveAlbumDetails",
         data: {"albumID": updateAlbumID},
         
         success: function(data, status){
            data.forEach(function(elem){
               $("#update-title").attr("value", elem.title);
               $("#update-artist").attr("value", elem.artist);
               $("#update-coverImage").attr("value", elem.coverImage);
               $("#update-price").attr("value", elem.price);
               $("#update-genre").attr("value", elem.genre);
               $("#update-tag1").attr("value", elem.tag1);
               $("#update-tag2").attr("value", elem.tag2);
            });//forEach()
         }
      });//ajax
   });
   
   //submit album attributes for update album form
   $("#updateAlbumAttributes").on("click", function(e){
      
     let albumID = updateAlbumID;
     let title = $("#update-title").val();
     let artist =$("#update-artist").val();
     let coverImage =$("#update-coverImage").val();
     let price =$("#update-price").val();
     let genre =$("#update-genre").val();
     let tag1 = $("#update-tag1").val();
     let tag2 =$("#update-tag2").val();
     
     $.ajax({
        method: "GET",
        url: "/api/updateAlbumsDatabase",
        data: {"title":title, "artist":artist, "coverImage":coverImage, "price":price, "albumID":albumID, "genre": genre, "tag1":tag1, "tag2":tag2},
        
        success: function(data, status){
           console.log(status);
        }
     });//ajax  
   });
   // ...end Form Validation section
   // ...end Functions section
}); //end document ready
