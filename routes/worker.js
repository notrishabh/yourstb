const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

var success = [];


route.get('/', ensureAuthenticateds, (req,res)=>{
    let sql = `SELECT * FROM worker`;
    db.query(sql, (err,results)=>{
        res.render('worker', {
            user : req.user,
            results : results,
            success
        })
    });
});

route.post('/add',ensureAuthenticateds,(req,res)=>{

      let sql = `INSERT INTO worker SET ?`;
      let values = {
        Name : req.body.name,
        password : req.body.password,
        Region : req.body.region,
        Mobile : req.body.mobile,
      };
      db.query(sql, values, (err,results)=>{
        if(!err){
          req.flash('success_msg', 'Saved Successfully!');
          res.redirect('/adminPanel/worker');
        }
      });
  
  });

route.post('/delete',ensureAuthenticateds,(req,res)=>{
    var id = req.body.id;
    let sql = `DELETE FROM worker WHERE id=${id}`;
    db.query(sql, (err,results)=>{
      if(!err){
        req.flash('error_msg', 'Record Deleted Successfully!');
        res.redirect('/adminPanel/worker');
      }
    });

});

route.post('/edit',ensureAuthenticateds,(req,res)=>{
    let sql = `UPDATE worker SET ? WHERE id=${req.body.id}`;
    let values = {
        Name : req.body.name,
        password : req.body.password,
        Mobile : req.body.mobile,
        Region : req.body.region,
        fixedComplaints : 0
    };
    db.query(sql,values, (err,results)=>{
      if(!err){
        req.flash('success_msg', 'Record Edited Successfully!');
        res.redirect('/adminPanel/worker');
      }
    });

});


module.exports = route;