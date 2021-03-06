const express = require("express");
const route = express.Router();
const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator
const Excel = require('exceljs');




route.get("/today/:id", ensureAuthenticateds, (req, res) => {
  var today = new Date();
  var dd = String(today.getDate());
  var mm = String(today.getMonth() + 1);
  var yyyy = String(today.getFullYear());
  var wid = req.params.id;
  var onework = "All";

  if (mm.length < 2) 
        mm = '0' + mm;
  if (dd.length < 2) 
      dd = '0' + dd;

  today = yyyy + "-" + mm + "-" + dd;

  if(wid == 0){
    let workerSql = `SELECT * FROM worker`;
    db.query(workerSql, (err,workerList)=>{
      let sql = `SELECT * FROM all_payment WHERE DATE_FORMAT(datePaid, "%Y-%m-%d" ) = "${today}" ORDER BY id DESC`;
      db.query(sql, (err, results) => {
        let sql = `SELECT SUM(Amount) AS total FROM all_payment WHERE DATE_FORMAT(datePaid, "%Y-%m-%d" ) = "${today}"`;
        db.query(sql, (err,rus)=>{
          var totalToday = rus[0].total;
          res.render("payments/today", {
          user: req.user,
          results: results,
          today: today,
          sum : totalToday,
          workerList : workerList,
          onework : onework
        });
        });
    
      });
    });

  }else{
    let workerSql = `SELECT * FROM worker`;
    db.query(workerSql, (err,workerList)=>{
      let sql = `SELECT * FROM all_payment WHERE DATE_FORMAT(datePaid, "%Y-%m-%d" ) = "${today}" AND addedBy = "${wid}" ORDER BY id DESC`;
      db.query(sql, (err, results) => {
        let sql = `SELECT SUM(Amount) AS total FROM all_payment WHERE DATE_FORMAT(datePaid, "%Y-%m-%d" ) = "${today}" AND addedBy = "${wid}"`;
        db.query(sql, (err,rus)=>{
          let oneWorker = `SELECT * FROM worker where id = "${wid}"`;
          db.query(oneWorker, (err,oneworkDetails)=>{
            onework = oneworkDetails[0].Name;
            var totalToday = rus[0].total;
            res.render("payments/today", {
              user: req.user,
              results: results,
              today: today,
              sum : totalToday,
              workerList : workerList,
              onework : onework,
            });
          });
        });
    
      });
    });
  }


});
route.get('/thisMonth/download', ensureAuthenticateds,(req,res)=>{
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

  var monthName = month[d.getMonth()];
  var monthNumber = d.getMonth() + 1;



  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('records');
  worksheet.views = [
      {state: 'frozen', ySplit: 1, activeCell: 'A1'}
  ];
  worksheet.columns = [
      { header: 'Name', key: 'Name', width: 32 },
      { header: 'Address', key: 'Address', width: 30 },
      { header: 'Stb', key: 'Stb', width: 15},
      { header: 'Mobile', key: 'Mobile', width: 15 },
      { header: 'Amount', key: 'Amount', width: 10 },
      { header: 'Date Paid', key: 'datePaid', width: 30 },
      { header: 'Validity', key: 'validity', width: 10 },
      { header: 'Date Start', key: 'dateStart', width: 30 },
      { header: 'Date Expiry', key: 'dateExpiry', width: 30 },
  ];
  let sql = `SELECT Name, Address, Mobile, Stb, Amount, datePaid, validity, dateStart, dateExpiry FROM all_payment WHERE month(datePaid) = "${monthNumber}" ORDER BY id DESC`;
  db.query(sql, (err,results)=>{
      results.forEach((result)=>{
          var data = JSON.parse(JSON.stringify(result));
          worksheet.addRow(data);
      });
      sendWorkbook(workbook,res);
  })
});

route.get("/thisMonth/:id", ensureAuthenticateds, (req, res) => {
  var wid = req.params.id;
  var onework = "All";
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

  var monthNumber = d.getMonth() + 1;
  var monthName = month[d.getMonth()];

  if(wid == 0){
    let workerSql = `SELECT * FROM worker`;
    db.query(workerSql, (err,workerList)=>{
      let sql = `SELECT * FROM all_payment WHERE month(datePaid) = "${monthNumber}" ORDER BY id DESC`;
      db.query(sql, (err, results) => {
        let sql = `SELECT SUM(Amount) AS total FROM all_payment WHERE month(datePaid) = "${monthNumber}"`;
        db.query(sql, (err, rus) => {

          var totalMonth = rus[0].total;
          res.render("payments/thisMonth", {
            user: req.user,
            month: monthName,
            results: results,
            workerList : workerList,
            onework : onework,
            sum : totalMonth
          });
        });
      });
    });
  }else{
    let workerSql = `SELECT * FROM worker`;
    db.query(workerSql, (err,workerList)=>{

      let sql = `SELECT * FROM all_payment WHERE month(datePaid) = "${monthNumber}" AND addedBy = "${wid}" ORDER BY id DESC`;
      db.query(sql, (err, results) => {
        let sql = `SELECT SUM(Amount) AS total FROM all_payment WHERE month(datePaid) = "${monthNumber}" AND addedBy = "${wid}"`;
        db.query(sql, (err, rus) => {

          let oneWorker = `SELECT * FROM worker where id = "${wid}"`;
          db.query(oneWorker, (err,oneworkDetails)=>{
            onework = oneworkDetails[0].Name;
            var totalMonth = rus[0].total;
            res.render("payments/thisMonth", {
              user: req.user,
              month: monthName,
              results: results,
              workerList : workerList,
              onework : onework,
              sum : totalMonth
            });
          });
        });
      });
    });
  }

});




async function sendWorkbook(workbook, response) { 

      var fileName = `ThisMonth.xlsx`;
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
  
       await workbook.xlsx.write(response);
  
      response.end();
}

route.get('/thisYear', ensureAuthenticateds, (req,res)=>{
    var d = new Date();
    var year = d.getFullYear();

    let sql = `SELECT * FROM all_payment WHERE year(datePaid) = "${year}" ORDER BY id DESC`;
    db.query(sql, (err,results)=>{
        res.render('payments/thisYear', {
            user : req.user,
            year : year,
            results : results
        });
    });
    
});

// route.get('/offline', ensureAuthenticateds, (req,res)=>{
//   let sql = `SELECT * FROM offline_payment ORDER BY id DESC`;
//   db.query(sql, (err,results)=>{
//     res.render('payments/offline', {
//       user : req.user,
//       results : results
//     })
//   });
// });

route.post('/today/delete', ensureAuthenticateds, (req,res)=>{
  var pid = req.body.pid;
  var stb = req.body.stb;

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

  let firstsql = `SELECT * FROM all_payment WHERE id = "${pid}"`;

  db.query(firstsql, (err,results)=>{
    var monthStart = results[0].dateStart.getMonth();
    var monthExpiry = results[0].dateExpiry.getMonth();
    var validity = results[0].validity;
    
    let sql = `DELETE FROM all_payment WHERE id = "${pid}"`;
    db.query(sql, (err,results)=>{
      if(!err){
        req.session.save((err)=>{
          if(!err){
            req.flash('error_msg', 'Payment Removed Successfully!');
            res.redirect("/adminPanel/payments/today");
          }
        });
        let lolsql = `SELECT * FROM all_payment WHERE Stb = "${stb}" ORDER by id DESC LIMIT 1`
        db.query(lolsql, (err,lols)=>{
          let values = {};
          let infosql = `UPDATE infos SET ? WHERE Stb = "${stb}"`;
          for(var i = 0; i < validity; i++){
            values[month[monthStart + i]] = 0;
          }
          if(lols.length > 0){
            values['dateExpiry'] = lols[0].dateExpiry;
            values['datePaid'] = lols[0].dateStart;
        }else{
          values['dateExpiry'] = 0;
          values['datePaid'] = 0;
     
        }
          db.query(infosql, values, (err,boi)=>{
          });
        });
    }else{
        req.flash('error_msg', 'ERROR');
        res.redirect("/adminPanel/payments/today");
    }
    });
  });
});

module.exports = route;
