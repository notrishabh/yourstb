const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator
const Excel = require('exceljs');

var success = [];



route.get("/",ensureAuthenticateds,(req,res)=>{
    let sql = `SELECT COUNT(infos.Stb) AS totalConnections, region.id, region.region_name FROM infos INNER JOIN region ON infos.region_id = region.id GROUP BY infos.region_id`;

    db.query(sql,(err,results)=>{
        res.render('fullList/fullList', {
            user : req.user,
            results : results,
            success

        });
    });

});

route.post("/edit/:region_id", ensureAuthenticateds, (req,res)=>{
    var region_id = req.params.region_id;
    let sql = `UPDATE infos SET ? WHERE Stb = "${req.body.stb}"`;
    let values = {
        Name : req.body.name,
        Address : req.body.address,
        Mobile : req.body.mobile
    };
    db.query(sql, values, (err,results)=>{
        if(!err){
            req.flash('success_msg', 'Record Edited Successfully!');
            res.redirect("/adminPanel/fullList/" + region_id);
        }
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
    let sql = `SELECT region.region_name,infos.Name,infos.Address,infos.Mobile,infos.Stb,infos.${monthName} AS Amount,infos.datePaid,infos.dateExpiry 
                FROM infos INNER JOIN region ON infos.region_id = region.id AND infos.region_id = ${region_id}`;
    db.query(sql, (err,results)=>{
        res.render('fullList/allRegions', {
            user : req.user,
            results : results,
            region_id : region_id,
            monthName : monthName,
            success

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
    ];
    let sql = `SELECT Name, Address, Mobile, Stb, ${monthName} AS Amount FROM infos WHERE region_id = "${region}"`;
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
        var fileName = `${regionName}.xlsx`;
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    
         await workbook.xlsx.write(response);
    
        response.end();
    });
}



module.exports = route;