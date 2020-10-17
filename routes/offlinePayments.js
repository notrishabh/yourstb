const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

var success = [];

route.get('/',ensureAuthenticateds, (req,res)=>{
    res.render("offlinePayments", {
        user : req.user,
        results : "none",
        displayDetails : "none",
        success
    });
});

route.post("/",ensureAuthenticateds, (req, res) => {
  stb = req.body.stb;
  let sql = `SELECT * FROM all_info WHERE stb = "${stb}"`;
  db.query(sql, (err, results) => {
    res.render("offlinePayments", {
      user: req.user,
      results: results[0],
      displayDetails: "block",
      noResults: "none",
      success
    });
  });
});


route.post('/savePayment',ensureAuthenticateds,(req,res)=>{
  var amount;
  var packageOpted;
  if(req.body.exampleField){
    amount = req.body.exampleField;
  }else{
    amount = req.body.exampleRadios;
  }
  if(amount == "153"){
    packageOpted = "Basic";
  } else if(amount == "275"){
    packageOpted = "Silver";
  }else if(amount == "360"){
    packageOpted = "Gold";
  }else if(amount == "454"){
    packageOpted = "Diamond";
  }else{
    packageOpted = "Custom";
  }
 //ADD QUERY FOR INSERTING in all_info in respective month in production
  db.query(`SELECT * FROM all_info WHERE Stb = "${req.body.Stb}"`,(err,results)=>{
    let sql = `INSERT INTO offline_payment SET ?`;
    let values = {
      Name : results[0].Name,
      Address : results[0].Address,
      Mobile : results[0].Mobile,
      Stb : results[0].Stb,
      Amount : amount,
      packageOpted : packageOpted
    };
    db.query(sql, values, (err,results)=>{
      if(!err){
        req.flash('success_msg', 'Saved Successfully!');
        res.redirect('/adminPanel/offlinePayments');
      }
    });
  });

});


module.exports = route;