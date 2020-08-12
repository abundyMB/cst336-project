$(document).ready(function() {

   // Global variables
   var updateAlbumID; //this is for the update album function
   localStorage.setItem("cartLength2", '1');

   // Event listeners.

   $("#add-form").on("submit", function() {

      // $("#validationFdbk").html(""); //resets validation feedback
      // if (!isAddFormValid()) {
      //    return;
      // }
      addAlbum();
   });

   // Find Album to update
   $("#find-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      // if (!isFindFormValid()) {
      //    return;
      // }
   });

   // Update function
   $("#update-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      if (!isUpdateFormValid()) {
         return;
      }
   });

   // Delete function
   $("#delete-form").on("submit", function() {
      $("#validationFdbk").html(""); //resets validation feedback
      console.log("Form delete");
      if (!isDeleteFormValid()) {
         event.preventDefault();
      }
      deleteAlbum();
   });

   // ...end Listener Section

   // start Functions Section

   /**
    * Add album function adds one album entry from the database and 
    * takes seven parameters for input.
    * 
    * @param title
    * @param artist
    * @param coverImage
    * @param price
    * @param genre
    * @param tag1
    * @param tag2
    * 
    */
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


   /**
    *updateAlbumsArray function takes seven parameters and updates the fields
    * for one album.
    * 
    * @param action
    * @param title
    * @param artist
    * @param coverImage
    * @param price
    * @param genre
    * @param tag1
    * @param tag2
    */
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

   /**
    * Delete album function deletes one album entry from the database and 
    * takes the albumID as input.
    * 
    * @param albumID
    */
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
   $("#updateAlbum").on("change", function() {
      updateAlbumID = $(this).val();
      $.ajax({
         method: "GET",
         url: "/api/retrieveAlbumDetails",
         data: { "albumID": updateAlbumID },

         success: function(data, status) {
            data.forEach(function(elem) {
               $("#update-title").attr("value", elem.title);
               $("#update-artist").attr("value", elem.artist);
               $("#update-coverImage").attr("value", elem.coverImage);
               $("#update-price").attr("value", elem.price);
               $("#update-genre").attr("value", elem.genre);
               $("#update-tag1").attr("value", elem.tag1);
               $("#update-tag2").attr("value", elem.tag2);
            }); //forEach()
         }
      }); //ajax
   });

   //submit album attributes for update album form
   $("#updateAlbumAttributes").on("click", function(e) {

      let albumID = updateAlbumID;
      let title = $("#update-title").val();
      let artist = $("#update-artist").val();
      let coverImage = $("#update-coverImage").val();
      let price = $("#update-price").val();
      let genre = $("#update-genre").val();
      let tag1 = $("#update-tag1").val();
      let tag2 = $("#update-tag2").val();

      $.ajax({
         method: "GET",
         url: "/api/updateAlbumsDatabase",
         data: { "title": title, "artist": artist, "coverImage": coverImage, "price": price, "albumID": albumID, "genre": genre, "tag1": tag1, "tag2": tag2 },

         success: function(data, status) {
            console.log(status);
         }
      }); //ajax  
   });
   // ...end Form Validation section
   // ...end Functions section
}); //end document ready
