const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

var success = [];

route.get('/', ensureAuthenticateds, (req,res)=>{
    res.render('history', {
        user : req.user,
        results : "none",
        displayDetails : "none",
        success
    });
});


route.post("/",ensureAuthenticateds, (req, res) => {
    stb = req.body.stb;
    let sql = `SELECT * FROM infos WHERE stb = "${stb}"`;
    db.query(sql, (err, results) => {
      res.render("history", {
        user: req.user,
        results: results[0],
        displayDetails: "block",
        noResults: "none",
        success
      });
    });
  });


module.exports = route;