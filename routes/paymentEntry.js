const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

var success = [];

route.get('/',ensureAuthenticateds, (req,res)=>{
    res.render("workerPanel/paymentEntry", {
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
    res.render("workerPanel/paymentEntry", {
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
  var duration = req.body.duration;
  duration = parseInt(duration);
  var balance;

  var startDate = req.body.startDate;


  var parts =startDate.split('-');
  var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
  var vardate = new Date(parts[0], parts[1] - 1, parts[2]); 


  
  if(req.body.balanceField){
    balance = req.body.balanceField;
  }else{
    balance = 0;
  }

  amount = req.body.exampleField;

  var totalAmount = amount * duration;


  db.query(`SELECT * FROM infos WHERE Stb = "${req.body.Stb}"`,(err,results)=>{
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
    month[12] = "January";
    month[13] = "February";
    month[14] = "March";
    month[15] = "April";
    month[16] = "May";
    month[17] = "June";
    month[18] = "July";
    month[19] = "August";
    month[20] = "September";
    month[21] = "October";
    month[22] = "November";
    month[23] = "December";
              
    var monthName = month[d.getMonth()];
    var dateExpiry = vardate;
    dateExpiry.setMonth(dateExpiry.getMonth() + duration);



    let listPay = `UPDATE infos SET ? WHERE Stb = "${results[0].Stb}"`;
    let listValues = {};
    for(var i =0; i<duration; i++){
        listValues[month[mydate.getMonth() + i]] = amount;
    }
    listValues['dateExpiry'] = dateExpiry;
    listValues['datePaid'] = mydate;
    if(balance > 0){
      listValues['status'] = 2;
      listValues['balance'] = balance;
    }else{
      listValues['status'] = 1;
    }
    db.query(listPay,listValues, (err,results)=>{
      if(err){
        console.log(err);
      }
    });
    let workersql = `UPDATE worker SET ? WHERE id = "${req.user.id}"`;
    workerValues = {
      noOfPayments : req.user.noOfPayments + 1,
      paymentAmount : req.user.paymentAmount + totalAmount
    };
    db.query(workersql,workerValues, (err,worked)=>{
      if(err){
        console.log(err);
      }
    });



    let all_payment = `INSERT INTO all_payment SET ?`;
    let all_values = {
        Name : results[0].Name,
        Address : results[0].Address,
        Mobile : results[0].Mobile,
        Stb : results[0].Stb,
        Amount : totalAmount,
        Mode : 'Offline',
        addedBy : req.user.id,
        validity : duration,
        dateStart : mydate,
        dateExpiry : dateExpiry
    };
    db.query(all_payment, all_values, (err,results)=>{
      if(!err){
        req.flash('success_msg', 'Saved Successfully!');
        res.redirect('/workerPanel/paymentEntry');
      }
    });


  });

});




module.exports = route;