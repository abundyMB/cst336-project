const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
//app.engine('html', require('ejs').renderFile);

//***View routes*** 
app.get("/", function(req, res){
 res.render("index.ejs");
});
 
app.get("/cart", function(req, res){
 res.render("cart.ejs");
});

app.get("/login", function(req, res){
 res.render("login.ejs");
});

app.get("/signup", function(req, res){
 res.render("signup.ejs");
});

app.get("/admin", function(req, res){
 res.render("admin.ejs");
});

app.get("/reports", function(req, res){
 res.render("reports.ejs");
});

//***API Routes*** 

app.get("/api/populateAlbumsArray", function(req, res){
 
 let sql = "SELECT * FROM albums";
 
 pool.query(sql, function(err, rows, fields){
  if (err) throw err;
  console.log(rows);
  res.send(rows);
  
 });

});//app.get(populateAlbumArray);



 //start server
 app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Express server is running...");
 });