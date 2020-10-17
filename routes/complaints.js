const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

route.get('/pending', ensureAuthenticateds, (req,res)=>{
    let sql = `SELECT * FROM complaint WHERE Checkbox = 0`;
    db.query(sql, (err,results)=>{
        res.render('complaints/pending', {
            user : req.user,
            results : results
        })
    });

});

route.post('/pending', (req,res)=>{
    let sql = `UPDATE complaint SET Checkbox = 1 WHERE id = "${req.body.id}"`;
    db.query(sql, (err,results)=>{
        res.redirect('/adminPanel/complaints/pending');
    });
});





module.exports = route;