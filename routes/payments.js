const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

route.get("/today", ensureAuthenticateds, (req, res) => {
  var today = new Date();
  var dd = String(today.getDate());
  var mm = String(today.getMonth() + 1);
  var yyyy = String(today.getFullYear());

  today = yyyy + "-" + mm + "-" + dd;

  let sql = `SELECT * FROM payment WHERE Date = "${today}" ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    res.render("payments/today", {
      user: req.user,
      results: results,
      today: today,
    });
  });
});

route.get("/thisMonth", ensureAuthenticateds, (req, res) => {
  var d = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var monthNumber = d.getMonth() + 1;
  var monthName = month[d.getMonth()];

    let sql = `SELECT * FROM payment WHERE month(Date) = "${monthNumber}" ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    res.render("payments/thisMonth", {
      user: req.user,
      month: monthName,
      results: results,
    });
  });
});

route.get('/thisYear', ensureAuthenticateds, (req,res)=>{
    var d = new Date();
    var year = d.getFullYear();

    let sql = `SELECt * FROM payment WHERE year(Date) = "${year}" ORDER BY id DESC`;
    db.query(sql, (err,results)=>{
        res.render('payments/thisYear', {
            user : req.user,
            year : year,
            results : results
        });
    });
    
});

route.get('/offline', ensureAuthenticateds, (req,res)=>{
  let sql = `SELECT * FROM offline_payment ORDER BY id DESC`;
  db.query(sql, (err,results)=>{
    res.render('payments/offline', {
      user : req.user,
      results : results
    })
  });
});

module.exports = route;
