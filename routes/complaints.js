const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator


var success = [];

route.get('/pending', ensureAuthenticateds, (req,res)=>{
    let sql = `SELECT * FROM worker`;
    db.query(sql, (err,results)=>{
        var workerList = results;
        let sql = `SELECT * FROM complaint WHERE Checkbox = 0`;
        db.query(sql, (err,results)=>{
            res.render('complaints/pending', {
                user : req.user,
                results : results,
                workerList : workerList,
                success
            })
        });
    });
});



route.post('/pending/workerFixed', (req,res)=>{
    let sql = `UPDATE complaint SET ? WHERE id = "${req.body.id}"`;
    var values = {
        Checkbox : 1,
        fixedBy : req.body.workerName
    };
    db.query(sql, values, (err,results)=>{
        let sql = `UPDATE worker SET fixedComplaints = fixedComplaints + 1 WHERE Name = "${req.body.workerName}"`;
        db.query(sql, (err,results)=>{
            if(!err){
                req.flash('success_msg', 'Complaint Fixed!');
                res.redirect('/adminPanel/complaints/pending');
            }
        });
    });
});





module.exports = route;