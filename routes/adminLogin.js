const express = require('express');
const passport = require('passport');
const route = express.Router();

var errors = []; //Flash errors



route.get('/', (req,res)=>{
    res.render('adminLogin', {
        errors
    });
});



//===========PASSPORT LOGIN SYSTEM=========

route.post('/', (req,res, next)=>{
    passport.authenticate('admin-local', {
        successRedirect: '/adminPanel',
        failureRedirect: '/adminLogin',
        failureFlash: true
    })(req,res,next);
});

//==========================================



module.exports = route;