const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator


route.get('/', ensureAuthenticateds, (req,res)=>{
    console.log(req.user);
    res.render('workerPanel/dashboard', {
        user : req.user
    });
});



route.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success_msg', 'You have logged out');
    res.redirect('/adminLogin');
});

route.use('/paymentEntry', require('./paymentEntry'));
route.use('/unpaidList', require('./unpaidListWorker'));
route.use('/history', require('./historyWorker'));




module.exports = route;