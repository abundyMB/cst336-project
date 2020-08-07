$(document).ready(function() {
    
    $("#totOrd-btn").on("click", generateTotalSalesReport);
    $("#avgOrd-btn").on("click", generateAvgOrderReport);
    $("#avgAlb-btn").on("click", generateAvgAlbumReport);
    
    // $("#reportTitle").html("");
    // $("#reportBody").html("");
    
    function generateTotalSalesReport(){
        $.ajax({
        method: "GET",
            url: "/api/totalSalesOrderReport",
            type: "JSON",

            success: function(data, status) {
                console.log("Report X");
                console.log(data);

                let totalSales = data[0].totalSales.toFixed(2);
                console.log("Total Sales: " + totalSales);

                $("#reportTitle").html("Total Sales");
                $("#reportBody").html(`The cumulative amount of sales to date is: $${totalSales}.`);
            }
        }); //ajax
    }
    
    function generateAvgOrderReport(){
        $.ajax({
        method: "GET",
            url: "/api/avgOrderReport",
            type: "JSON",

            success: function(data, status) {
                console.log(data);
                
                let orderAvg = data[0].orderAvg.toFixed(2);
                console.log("Order Average: " + orderAvg);
                
                $("#reportTitle").html("Average Order Cost");
                $("#reportBody").html(`Across all orders, we have found the total amount customers
                    paid for their order, on average, to be: $${orderAvg}.`);
            }
        }); //ajax
    }
    function generateAvgAlbumReport(){
        
        $.ajax({
        method: "GET",
            url: "/api/avgAlbumReport",
            type: "JSON",

            success: function(data, status) {
                console.log(data);
                
                let avgPrice = data[0].averagePrice.toFixed(2);
                console.log("Average Album Price: " + avgPrice);
                
                $("#reportTitle").html("Average Album Price");
                $("#reportBody").html(`The average price of all albums offered by Fidelity Audio
                is: $${avgPrice}.`);
            }
        }); //ajax
    }
});//end