const express = require("express");
const app = express();
const session = require('express-session');
const request = require("request");
const bcrypt = require('bcrypt');
const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
//app.engine('html', require('ejs').renderFile);

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));

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

// Still needs to be built.
app.get("/myAccount", function(req, res){
 res.send("My Account page currently under construction.");
});

app.get("/admin", isAuthenticated, function(req, res){
 res.render("admin.ejs");
});

app.get("/reports", isAuthenticated, function(req, res){
 res.render("reports.ejs");
});

app.get("/signup", function(req, res){
 res.render("signup.ejs");
});

// Still needs to be built.
app.get("/thankYou", function(req, res){
 res.send("Thank you page currently under construction.");
});

// Likely will be "hidden" page in final project. Currently accessible for
// testing purposes.
app.get("/adminLogin", function(req, res){
 res.render("adminLogin.ejs");
});

app.get("/logout", function(req, res) {
   req.session.destroy();
   res.redirect("/");
});

app.post("/", async function(req, res) {
    
    let username = req.body.adminuser;
    let password = req.body.adminpwd;
    
    let result = await checkUsername(username);
    console.dir(result);
    let hashedPwd = "";
    
    if (result.length > 0) {
        hashedPwd = result[0].password;
    }
    
    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);
    
    if (passwordMatch) {
        console.log("Password and username Match");
        req.session.authenticated = true;
        res.render("index");
    }
    else {
        console.log("No match");
        
//      Currently used to easily show when credentials aren't a match.
        res.render("cart"); //, {"loginError":true});
    }
});

//***API Routes*** 

// app.get("/api/populateAlbumsArray", function(req, res){
 
//  let sql = "SELECT * FROM albums";
 
//  pool.query(sql, function(err, rows, fields){
//   if (err) throw err;
//   console.log(rows);
//   res.send(rows);
  
//  });

// });//app.get(populateAlbumArray);

//start server
app.listen(process.env.PORT, process.env.IP, function(){
 console.log("Express server is running...");
});

// Verify password is valid. Currently only for admin.
function checkUsername(username) {
    let sql = "SELECT * FROM admin WHERE username = ? ";
    return new Promise( function(resolve, reject) {
       pool.query(sql, [username], function(err, rows, fields) {
          if (err) throw err;
          console.log("Rows found: " + rows.length);
          resolve(rows);
        });
    });
}

// Make sure password is valid.
function checkPassword(password, hashedValue) {
    return new Promise( function(resolve, reject) {
       bcrypt.compare(password, hashedValue, function(err, result) {
         if (err) throw err;
         console.log("Result: " + result);
         resolve(result);
       });
    });
}

function isAuthenticated(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect("/adminLogin");
    }
    else {
        next();
    }
}