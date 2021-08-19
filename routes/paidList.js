const express = require('express');
const route = express.Router();
const mysql = require("mysql");
const {ensureAuthenticateds} = require('../config/adminAuth');    //Login Authenticator
const Excel = require('exceljs');

var success = [];

route.get('/', ensureAuthenticateds, (req,res)=>{
    res.render('paidList', {
        user: req.user,
        results : "none",
        displayDetails : "none",
        monthDrop : 0,
        yearDrop : 0,
        monthName : "",
        success
    });
});

route.post('/', ensureAuthenticateds, (req,res)=>{
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

    var monthDrop = req.body.monthDrop;
    var yearDrop = req.body.yearDrop;

    var monthName = month[monthDrop];

    //let sql = `SELECT Name,Address,Mobile,Stb,${monthName} AS Amount FROM infos WHERE ${monthName} != '0'`;
    let sql = `SELECT Name,Address,Mobile,Stb,Amount/validity AS Amount,dateStart,dateExpiry FROM all_payment WHERE MONTH(dateStart) <= ${monthDrop}+1 and Month(dateExpiry) > ${monthDrop}+1 and dateStart != 0 and validity != 0 and YEAR(dateStart) = ${yearDrop}`;
    db.query(sql, (err,results)=>{
    
        res.render('paidList', {
            user: req.user,
            results: results,
            displayDetails: "block",
            noResults: "none",
            monthDrop : monthDrop,
            yearDrop : yearDrop,
            monthName : monthName,
            success
        });
    });
});


route.get('/:monthDrop/:yearDrop/download', ensureAuthenticateds,(req,res)=>{

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

    var monthDrop = req.params.monthDrop;
    var yearDrop = req.params.yearDrop;

    var monthName = month[monthDrop];


    const workbook = new Excel.Workbook();

//    let xdsql = `SELECT infos.region_id, region.region_name 
//               FROM infos INNER JOIN region 
//               ON infos.region_id = region.id 
//               GROUP BY infos.region_id;
//               SELECT region_id, Name, Address, Stb, Mobile, ${monthName} AS Amount FROM infos WHERE ${monthName} != '0'`; 
//
    let sql = `SELECT i.region_id, r.region_name FROM all_payment AS p JOIN infos AS i ON p.Stb = i.Stb JOIN region as r ON r.id = i.region_id GROUP BY r.region_name;SELECT p.Name,p.Address,p.Mobile,p.Stb,p.Amount/p.validity AS Amount,p.dateStart,p.dateExpiry, region_id FROM all_payment AS p,infos WHERE MONTH(p.dateStart) <= ${monthDrop} + 1 and Month(p.dateExpiry) > ${monthDrop} + 1 and p.dateStart != 0 and p.validity != 0 and YEAR(p.dateStart) = ${yearDrop} AND p.Stb = infos.Stb`;


    //let xddd=    `SELECT Name,Address,Mobile,Stb,Amount/validity AS Amount,dateStart,dateExpiry FROM all_payment WHERE MONTH(dateStart) <= ${monthDrop}+1 and Month(dateExpiry) > ${monthDrop}+1 and dateStart != 0 and validity != 0 and YEAR(dateStart) = ${yearDrop}`;
    //const worksheet = workbook.addWorksheet('Paid list');
   // worksheet.views = [
   //     {state: 'frozen', ySplit: 1, activeCell: 'A1'}
   // ];
   // worksheet.columns = [
   //     { header: 'Name', key: 'Name', width: 32 },
   //     { header: 'Address', key: 'Address', width: 30 },
   //     { header: 'Stb', key: 'Stb', width: 15},
   //     { header: 'Mobile', key: 'Mobile', width: 15 },
   //     { header: 'Amount', key: 'Amount', width: 10 },
   // ];
   // db.query(sql, (err,results)=>{
   //     results.forEach((result)=>{
   //         var data = JSON.parse(JSON.stringify(result));
   //         worksheet.addRow(data);
   //     });
   //     sendWorkbook(workbook,res,monthName);
   // })
    db.query(sql, (err,results)=>{
        results[0].forEach(lol=>{
            let worksheet = workbook.addWorksheet(lol.region_name);
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
            
            results[1].forEach((result)=>{
                if(result.region_id == lol.region_id){
                    var data = JSON.parse(JSON.stringify(result));
                    // console.log(data);
                    worksheet.addRow(data);
                }
           
            }); 

        });
        sendWorkbook(workbook,res,monthName);
    });


    // let newsql = `SELECT infos.region_id, region.region_name FROM infos INNER JOIN region ON infos.region_id = region.id GROUP BY infos.region_id`;
    // db.query(newsql, (err,results)=>{
    //     results.forEach(lol =>{
    //         const worksheet = workbook.addWorksheet(`${lol.region_name}`);
    //         worksheet.views = [
    //             {state: 'frozen', ySplit: 1, activeCell: 'A1'}
    //         ];
    //         worksheet.columns = [
    //             { header: 'Name', key: 'Name', width: 32 },
    //             { header: 'Address', key: 'Address', width: 30 },
    //             { header: 'Stb', key: 'Stb', width: 15},
    //             { header: 'Mobile', key: 'Mobile', width: 15 },
    //             { header: 'Amount', key: 'Amount', width: 10 },
    //         ];
    //         // worksheet.addRow({Name: 'lol', Address: 'dsadasd', Stb: '165161', Mobile: 18918918, Amount: 250});
    //         // worksheet.addRow({ Name: 'Umesh Sanitary',
    //         // Address: '12/3 Road side g.f',
    //         // Stb: '62965207',
    //         // Mobile: 9312648584,
    //         // Amount: 100 });
    //         let sql = `SELECT Name, Address, Stb, Mobile, ${monthName} AS Amount FROM infos WHERE ${monthName} != '0' AND region_id = "${lol.region_id}"`;
    //         db.query(sql, (err,results)=>{
    //         //  console.log(results);
             
    //             results.forEach((result)=>{
    //                 var data = JSON.parse(JSON.stringify(result));
    //                 // console.log(data);
    //                 worksheet.addRow(data);
    //             }); 

    //         });

    //     });

    //     sendWorkbook(workbook,res,monthName);

    
    // });

});

async function sendWorkbook(workbook, response, monthName) { 

        var fileName = `${monthName}` + " Paid List" + ".xlsx";
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    
         await workbook.xlsx.write(response);
    
        response.end();
   
}

module.exports = route;
