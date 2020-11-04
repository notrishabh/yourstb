const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator
const Excel = require('exceljs');

route.get("/",ensureAuthenticateds,(req,res)=>{
    let sql = `SELECT * FROM infos WHERE suspended = 1`;

    db.query(sql,(err,results)=>{
        res.render('suspendedList', {
            user : req.user,
            results : results,
        });
    });

});



module.exports = route;