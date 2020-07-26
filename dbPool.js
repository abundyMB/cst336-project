const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "wp433upk59nnhpoh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "q2gdsws5w8d887da",
    password: "ypflq0c2tdriopfm",
    database: "nbuvunrpult2vehb"
});

module.exports = pool;