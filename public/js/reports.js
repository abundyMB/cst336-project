$(document).ready(function() {

   $("#totOrd-btn").on("click", generateTotalSalesReport);
   $("#avgOrd-btn").on("click", generateAvgOrderReport);
   $("#avgAlb-btn").on("click", generateAvgAlbumReport);

   /**
    * generateTotalSalesReport calculates the sum of all sales. 
    */
   function generateTotalSalesReport() {
      $.ajax({
         method: "GET",
         url: "/api/totalSalesOrderReport",
         type: "JSON",

         success: function(data, status) {

            let totalSales = data[0].totalSales.toFixed(2);

            $("#reportTitle").html("Total Sales");
            $("#reportBody").html(`The cumulative amount of sales to date is: $${totalSales}.`);
         }
      }); //ajax
   }

   /**
    * generateAvgOrderReport calculates the average user order total.
    */
   function generateAvgOrderReport() {
      $.ajax({
         method: "GET",
         url: "/api/avgOrderReport",
         type: "JSON",

         success: function(data, status) {

            let orderAvg = data[0].orderAvg.toFixed(2);;

            $("#reportTitle").html("Average Order Cost");
            $("#reportBody").html(`Across all orders, we have found the total amount customers
                    paid for their order, on average, to be: $${orderAvg}.`);
         }
      }); //ajax
   }

   /**
    * generateAvgAlbumReport calculates the average album price of the albums
    * in the database.
    */
   function generateAvgAlbumReport() {

      $.ajax({
         method: "GET",
         url: "/api/avgAlbumReport",
         type: "JSON",

         success: function(data, status) {

            let avgPrice = data[0].averagePrice.toFixed(2);

            $("#reportTitle").html("Average Album Price");
            $("#reportBody").html(`The average price of all albums offered by Fidelity Audio
                is: $${avgPrice}.`);
         }
      }); //ajax
   }
}); //end
