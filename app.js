const express = require("express");
const app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));

//routes 
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

app.get("/api/updateFavorites", function(req, res){
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case "add": sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
                sqlParams = [req.query.imageUrl, req.query.keyword];
                break;
    case "delete": sql = "DELETE FROM favorites WHERE imageUrl = ?";
                sqlParams = [req.query.imageUrl];
                break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });
});//api/updateFavorites


app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageUrlArray = ["img/favorite.png"];
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("favorites", {"imageUrlArray": imageUrlArray, "rows":rows});
  });  
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
    
});//api/getFavorites

 //start server
 app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Express server is running...");
 });