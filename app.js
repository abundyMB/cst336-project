const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const pool = require('./dbPool.js');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({ // session variable is created
   secret: "top secret!",
   resave: true,
   saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

//start server listener
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Express server is running...");
});

//***View routes*** 
app.get("/", function(req, res) { // root route
   if (!req.session.numAlbumsInCart && !req.session.authenticated) {
      req.session.numAlbumsInCart = 0;
   }
   
   if (req.session.authenticated)
      res.render("index.ejs");
   else 
      res.render("index.ejs", { "numAlbumsInCart": req.session.numAlbumsInCart});
});

app.get("/cart", function(req, res) { // cart page route
   
   if (!req.session.numAlbumsInCart && !req.session.authenticated) {
      req.session.numAlbumsInCart = 0;
   }
   
   if (req.session.authenticated)
      res.render("cart.ejs");
   else 
      res.render("cart.ejs", { "numAlbumsInCart": req.session.numAlbumsInCart });
});

// admin page route only allows admin to be accessed if an admin is signed in.
app.get("/admin", isAuthenticated, function(req, res) {
   res.render("admin.ejs");
});

// reports page route only allows admin to be accessed if an admin is signed in.
app.get("/reports", isAuthenticated, function(req, res) {
   res.render("reports.ejs");
});

// Logs out of current session. 
app.get("/logout", function(req, res) {
   req.session.destroy();
   res.redirect("/");
});

app.post("/", async function(req, res) { // post route route

   let username = req.body.adminuser;
   let password = req.body.adminpwd;

   let result = await checkUsername(username, req);
   console.dir(result);
   let hashedPwd = "";

   if (result.length > 0) {
      hashedPwd = result[0].password;
   }

   let passwordMatch = await checkPassword(password, hashedPwd);
   
   if (passwordMatch) {
      req.session.authenticated = true;
      req.session.numAlbumsInCart = null;
      req.session.albumIDs = null;
      res.render("admin");
   }
   else {
      res.render("adminLogin.ejs", { "loginError": true });
   }
});

//***API Routes*** 
app.get("/api/populateAlbumsArray", function(req, res) {
   let sql = "SELECT * FROM albums";

   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);
   });
}); //api/populateAlbumsArray

//setCart API route sets the customer cart once a customer clicks the add to cart button
app.get("/api/setCart", function(req, res) {
   
   req.session.numAlbumsInCart = getNumAlbumsInCart(req.query.albumIDs);
   
   let sql = 'INSERT INTO cart (albumIDs, customerID) VALUES (?, ?)';
   let sqlParams = [req.query.albumIDs, req.session.id];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows.affectedRows.toString());
   });
}); //api/setCart

//getCart API route gets the albumIDs from the cart to display on the cart.ejs page
app.get("/api/getCart", function(req, res) {
   
   let sql = 'SELECT albumIDs FROM cart WHERE customerID = ? ORDER BY cartID DESC LIMIT 1';
   let sqlParams = [req.session.id]; 

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      if (!rows[0]) {
         req.session.albumIDs = "";
         req.session.numAlbumsInCart = 0;
      }
      res.send(rows);
   });
}); //api/getCart

//submitOrder adds the customer order to the orders table
app.get("/api/submitOrder", function(req, res) {
   // Delete contents of cart for active user.
   deleteCart(req, res);

   let sql = 'INSERT INTO orders (albumIDs, albumTitles, orderTotal) VALUES (?,?,?)';
   let sqlParams = [req.query.albumIDs, req.query.albumTitles, req.query.orderTotal];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows.affectedRows.toString());
   });
}); //api/submitOrder

// Add albums to the database, using all fields
app.get("/api/addAlbumsArray", function(req, res) {
   let sql = "INSERT INTO albums (title, artist, coverImage, price, genre, tag1, tag2) VALUES (?, ?, ?, ?, ?, ?, ?)";
   let sqlParams = [req.query.title, req.query.artist, req.query.coverImage, req.query.price, req.query.genre, req.query.tag1, req.query.tag2];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      res.send(rows.affectedRows.toString());
   });
}); // api/addAlbumsArray

//api to update album attributes in database
app.get("/api/updateAlbumsDatabase", function(req, res) {
   let sql = "UPDATE albums SET title =?, artist =?, coverImage =?, price =?, genre=?, tag1=?, tag2=? WHERE albumID =?";
   let sqlParams = [req.query.title, req.query.artist, req.query.coverImage, req.query.price, req.query.genre, req.query.tag1, req.query.tag2, req.query.albumID];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows.affectedRows.toString());
      res.send(rows.affectedRows.toString());
   });
});
//api/retrieveAlbumDetails

//api to retrieve album attributes in database
app.get("/api/retrieveAlbumDetails", function(req, res) {
   let sql = "SELECT * FROM albums where albumID =?";
   let sqlParams = [req.query.albumID];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      res.send(rows);
   });
}); //api/retrieveAlbumDetails

//api to update album attributes in database
app.get("/api/updateAlbumsArray", function(req, res) {
   let sql = "INSERT INTO albums (title, artist, coverImage, price, genre, tag1, tag2) VALUES (?, ?, ?, ?, ?, ?, ?)";
   let sqlParams = [req.query.title, req.query.artist, req.query.coverImage, req.query.price, req.query.genre, req.query.tag1, req.query.tag2];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      res.send(rows.affectedRows.toString());
   });
}); // api/updateAlbumsArray

// api to delete an album from the database
app.get("/api/deleteAlbum", function(req, res) {
   let sql = "DELETE FROM albums WHERE albumID = ?";
   let sqlParams = [req.query.albumID];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      res.send(rows.affectedRows.toString());
   });
}); // api/deleteAlbumsArray

// api to generate total sales report
app.get("/api/totalSalesOrderReport", function(req, res) {

   let sql = "SELECT SUM(orderTotal) AS totalSales FROM orders";

   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);
   });
});

// api to generate average order report
app.get("/api/avgOrderReport", function(req, res) {

   let sql = "SELECT AVG(orderTotal) AS orderAvg FROM orders";

   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);
   });
});

// api to generate average album report
app.get("/api/avgAlbumReport", function(req, res) {

   let sql = "SELECT AVG(price) AS averagePrice FROM albums";

   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);
   });
});

/**
 * Verify password is valid. Currently only for admin.
 * 
 * @param username
 * @param req
 */
function checkUsername(username, req) {
   let sql = "SELECT * FROM admin WHERE username = ? ";
   return new Promise(function(resolve, reject) {
      pool.query(sql, [username], function(err, rows, fields) {
         if (err) throw err;
            console.log(rows);

         resolve(rows);
      });
   });
}


/**
 * Make sure password is valid.
 * 
 * @param password
 * @param hashedValue
 */
function checkPassword(password, hashedValue) {
   return new Promise(function(resolve, reject) {
      bcrypt.compare(password, hashedValue, function(err, result) {
         if (err) throw err;
         console.log("Result: " + result);
         resolve(result);
      });
   });
}

// Makes sure user is signed in as admin before certain pages are accessed.
// Currently only for admin.
function isAuthenticated(req, res, next) {
   if (!req.session.authenticated) {
      res.render("adminLogin.ejs");
   }
   else {
      next();
   }
}

// Deletes entire cart table. Will delete only contents at customerID if 
// sign-in is required.
function deleteCart(req, res) {
   let sql = "DELETE FROM cart WHERE customerID = ?";
   let sqlParams = [req.session.id];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
   });
}

// Gets number of albums in the cart whenever cart is retrieved or set.
function getNumAlbumsInCart(cartString) {
   let numAlbumsInCart = 0;
   let cartAlbumsArr = cartString.split(" ");
   
   for (let i = 0; i < cartAlbumsArr.length; i++) {
      if (cartAlbumsArr[i] != '') {
         numAlbumsInCart++;
      }
   }
   
   return numAlbumsInCart;
}