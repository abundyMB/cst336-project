$(document).ready(function() {
    
    //Global Variables
                
    const xButton = document.getElementById('x-btn');
    const yButton = document.getElementById('y-btn');
    const zButton = document.getElementById('z-btn');
               
    //Event Listeners
    xButton.addEventListener('click', generateReportX); 
    yButton.addEventListener('click', generateReportY);
    zButton.addEventListener('click', generateReportZ);
    
    function generateReportX(){
        alert("Generating Report X...");
    }
    
    function generateReportY(){
        $.ajax({
        method: "GET",
            url: "/api/generateReportY",
            type: "JSON",

            success: function(data, status) {
                console.log("Report Y");
                console.log(data);
                data.forEach(function(elem, i) {
                    //using // let sql = "SELECT title, price FROM albums";
                    // albumObject = { title: elem.title, price: elem.price};
                    // albumsArray[i] = albumObject;
                    
                    
                    //   albumObject = {title: elem.title, price: elem.price};
                    //  albumObject = {AveragePrice: elem.averagePrice};

                    //   console.log($("#tempReportZText")) 
                    
                    // albumObject = {Price: elem.averagePrice };
                    // albumsArray[i] = albumObject;
                    // console.log(albumObject);
                    
                    // console.log(data);
                    
                    //   console.log($("#tempReportZText").append(`numberofSearches: elem.count`));
                    //   console.log((`numberofSearches: elem.count`))
                    //  console.log($("#tempReportZText").append(`numberofSearches: elem.count`));
                    //  res.render($("#tempReportZText"), {"numberofSearches": elem.count});
                });
            }
        }); //ajax
    }
    function generateReportZ(){
        
        $.ajax({
        method: "GET",
            url: "/api/generateReportZ",
            type: "JSON",

            success: function(data, status) {
                // console.log("Status is " + status);
                // console.log(data);
                // alert("Generating Report Z...");
                // console.log("Average Price ....");
                console.log("Report Z");
                console.log(data);
                data.forEach(function(elem, i) {
                    //using // let sql = "SELECT title, price FROM albums";
                    // albumObject = { title: elem.title, price: elem.price};
                    // albumsArray[i] = albumObject;
                    
                    
                    //   albumObject = {title: elem.title, price: elem.price};
                    //  albumObject = {AveragePrice: elem.averagePrice};

                    //   console.log($("#tempReportZText")) 
                    
                    // albumObject = {Price: elem.averagePrice };
                    // albumsArray[i] = albumObject;
                    // console.log(albumObject);
                    
                    // console.log(data);
                    
                    //   console.log($("#tempReportZText").append(`numberofSearches: elem.count`));
                    //   console.log((`numberofSearches: elem.count`))
                    //  console.log($("#tempReportZText").append(`numberofSearches: elem.count`));
                    //  res.render($("#tempReportZText"), {"numberofSearches": elem.count});
                });
            }
        }); //ajax
    }
    
});//end