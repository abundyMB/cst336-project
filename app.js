const express = require("express");
const app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));

//routes 
app.get("/", function(req, res){
 
 res.render("index.html");
 });
 
 app.get("/cart", function(req, res){
 
 res.render("cart.html");
 });
 

 //start server
 app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Express server is running...");
  });
  
