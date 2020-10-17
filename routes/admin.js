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

    let sql = `SELECT SUM(Amount) AS total FROM payment WHERE MONTH(Date) = "${mm}"`;
    db.query(sql,(err,results)=>{
        monthlyEarnings = results[0].total;
        let sql = `SELECT SUM(Amount) AS total FROM payment WHERE YEAR(Date) = "${yyyy}"`;
        db.query(sql, (err,results)=>{
            yearlyEarnings = results[0].total;
            let sql = `SELECT * FROM payment ORDER BY id DESC LIMIT 1`;
            db.query(sql, (err,results)=>{
                latestName = results[0].Name;
                latestAmount = results[0].Amount;
                let sql = `SELECT COUNT(id) AS total FROM complaint WHERE Checkbox = 0`;
                db.query(sql, (err, results)=>{
                    totalComplaints = results[0].total;
                    let sql = `SELECT SUM(Amount) AS sum,month(Date) AS month FROM payment GROUP BY month(Date)`;
                    db.query(sql, (err,results)=>{
                        sum = results;
                        let sql = `SELECT COUNT(id) AS onlineCount FROM payment`;
                        db.query(sql, (err,results)=>{
                            onlineCount = results[0].onlineCount;
                            let sql = `SELECT COUNT(id) AS offlineCount FROM offline_payment`;
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

route.get('/no',(req,res)=>{
    let sql = `SELECT SUM(Amount),month(Date) FROM payment GROUP BY month(Date)`;

    let sql2 = `SELECT (SUM(t1.Amount) + SUM(t2.Amount)) AS SUMBITCH, t2.Stb, month(t1.Date) FROM payment t1 JOIN offline_payment t2 ON month(t1.Date)=month(t2.dateTime) GROUP BY month(Date)`

    let sql3 = `SELECT payment.Amount FROM payment LEFT OUTER JOIN offline_payment ON month(payment.Date)=month(offline_payment.dateTime)`;

    let sql4 = `SELECT *
    FROM offline_payment
    LEFT OUTER JOIN payment ON month(payment.Date) = month(offline_payment.dateTime)
    
    UNION ALL
    
    SELECT *
    FROM offline_payment
    RIGHT OUTER JOIN payment ON month(payment.Date) = month(offline_payment.dateTime)
    WHERE month(offline_payment.dateTime) IS NULL`;
    db.query(sql4, (err,results)=>{
        console.log(results);
        res.send(JSON.stringify(results, null, 4));
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
route.use('/fullList', require('./fullList'));


module.exports = route;