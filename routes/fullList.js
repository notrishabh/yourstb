const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator
const Excel = require('exceljs');


route.get('/:region',ensureAuthenticateds, (req,res)=>{
    var region = req.params.region;
    let sql = `SELECT Name, Address, Mobile, Stb, October AS Amount FROM all_info WHERE Address LIKE "${region}%"`;
    db.query(sql, (err,results)=>{
        res.render('fullList/allRegions', {
            user : req.user,
            results : results,
            region : region
        });
    });
});

route.get('/:region/download', ensureAuthenticateds,(req,res)=>{
    var region = req.params.region;
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
    let sql = `SELECT Name, Address, Mobile, Stb, October AS Amount FROM all_info WHERE Address LIKE "${region}%"`;
    db.query(sql, (err,results)=>{
        results.forEach((result)=>{
            var data = JSON.parse(JSON.stringify(result));
            worksheet.addRow(data);
        });
        sendWorkbook(workbook,res,region);
    })
});


async function sendWorkbook(workbook, response, region) { 

    // var fileName = 'newboi.xlsx';

    var fileName = `${region}.xlsx`

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

     await workbook.xlsx.write(response);

    response.end();
}



module.exports = route;