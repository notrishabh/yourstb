const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator
const Excel = require('exceljs');


route.get("/",ensureAuthenticateds,(req,res)=>{
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

    let sql =   `SELECT COUNT(infos.Stb) AS unpaidConnections, region.id, region.region_name 
                FROM infos INNER JOIN region ON infos.region_id = region.id AND ${monthName} = 0 OR dateExpiry < "${d}"
                GROUP BY infos.region_id`;

    db.query(sql,(err,results)=>{
        res.render('unpaidList/fullUnpaid', {
            user : req.user,
            results : results
        });
    });

});


route.get('/:region_id',ensureAuthenticateds, (req,res)=>{
    var region_id = req.params.region_id;
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
    let sql = `SELECT region.region_name,infos.Name,infos.Address,infos.Mobile,infos.Stb,infos.${monthName} AS Amount 
                FROM infos INNER JOIN region ON infos.region_id = region.id AND infos.region_id = ${region_id} AND ${monthName} = 0`;
    db.query(sql, (err,results)=>{
        res.render('unpaidList/allRegions', {
            user : req.user,
            results : results,
            region_id : region_id
        });
    });
});

route.get('/:region/download', ensureAuthenticateds,(req,res)=>{
    var region = req.params.region;

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
    
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Unpaid Records');
    worksheet.views = [
        {state: 'frozen', ySplit: 1, activeCell: 'A1'}
    ];
    worksheet.columns = [
        { header: 'Name', key: 'Name', width: 32 },
        { header: 'Address', key: 'Address', width: 30 },
        { header: 'Stb', key: 'Stb', width: 15},
        { header: 'Mobile', key: 'Mobile', width: 15 },
        { header: 'Amount', key: 'Amount', width: 10 },
    ];
    let sql = `SELECT Name, Address, Mobile, Stb, ${monthName} AS Amount FROM infos WHERE region_id = "${region}" AND ${monthName} = 0`;
    db.query(sql, (err,results)=>{
        results.forEach((result)=>{
            var data = JSON.parse(JSON.stringify(result));
            worksheet.addRow(data);
        });
        sendWorkbook(workbook,res,region);
    })
});


async function sendWorkbook(workbook, response, region) { 

    let sql = `SELECT region_name FROM region WHERE id = ${region}`;
    db.query(sql,async(err,results)=>{
        var regionName = results[0].region_name;
        var fileName = `Unpaid ${regionName}.xlsx`;
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    
         await workbook.xlsx.write(response);
    
        response.end();
    });
}




module.exports = route;