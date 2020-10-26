const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator



route.get('/', ensureAuthenticateds, (req,res)=>{
    console.log(req.user);
    var monthlyEarnings = 'NA';
    var yearlyEarnings = 'NA';
    var latestName = 'NA';
    var latestAmount = 'NA';
    var totalComplaints = 'NA';
    var sum = 'NA';
    var onlineCount = 'NA';
    var offlineCount = 'NA';


    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1);
    var yyyy = String(today.getFullYear());

    today = yyyy + '-' + mm + '-' + dd;

    let sql = `SELECT SUM(Amount) AS total FROM payment WHERE MONTH(dateTime) = "${mm}"`; //MONTHLY CARD
    db.query(sql,(err,results)=>{
        monthlyEarnings = results[0].total;
        let sql = `SELECT SUM(Amount) AS total FROM payment WHERE YEAR(dateTime) = "${yyyy}"`; //YEARLY CARD
        db.query(sql, (err,results)=>{
            yearlyEarnings = results[0].total;
            let sql = `SELECT * FROM payment ORDER BY id DESC LIMIT 1`; //LATEST PAYMENT CARD
            db.query(sql, (err,results)=>{
                latestName = results[0].Name;
                latestAmount = results[0].Amount;
                let sql = `SELECT COUNT(id) AS total FROM complaint WHERE Checkbox = 0`; //LATEST COMPLAINT CARD
                db.query(sql, (err, results)=>{
                    totalComplaints = results[0].total;
                    let sql = `SELECT SUM(Amount) AS sum,month(dateTime) AS month FROM payment GROUP BY month(dateTime)`; //EARNING CHART
                    db.query(sql, (err,results)=>{
                        sum = results;
                        let sql = `SELECT COUNT(id) AS onlineCount FROM payment`; //PIE CHART
                        db.query(sql, (err,results)=>{
                            onlineCount = results[0].onlineCount;
                            let sql = `SELECT COUNT(id) AS offlineCount FROM offline_payment`;  //PIE CHART
                            db.query(sql,(err,results)=>{
                                offlineCount = results[0].offlineCount;
                                res.render('adminPanel', {
                                    user : req.user,
                                    monthlyEarnings : monthlyEarnings,
                                    yearlyEarnings : yearlyEarnings,
                                    latestName : latestName,
                                    latestAmount : latestAmount,
                                    totalComplaints : totalComplaints,
                                    sum : sum,
                                    onlineCount : onlineCount,
                                    offlineCount : offlineCount
                                });
                            });
                            
                        });
                       
                    });

                    

                });

                
            });
            
        });
        
    });
    
});









route.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success_msg', 'You have logged out');
    res.redirect('/adminLogin');
});


route.use('/payments', require('./payments'));
route.use('/complaints', require('./complaints'));
route.use('/offlinePayments', require('./offlinePayments'));
route.use('/offlineComplaints', require('./offlineComplaints'));
route.use('/fullList', require('./fullList'));
route.use('/unpaidList', require('./unpaidList'));
route.use('/worker', require('./worker'));
route.use('/newStb', require('./newStb'));


module.exports = route;