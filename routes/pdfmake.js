const express = require('express');
const router = express.Router();

const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');

const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.get('/:id/pdf', ensureAuthenticateds,(req, res, next)=>{
    //res.send('PDF');
    let id = req.params.id;
    let sql = `SELECT * FROM all_payment WHERE id = ${id}`;
    db.query(sql, (err,results)=>{
        console.log(results);
        let date = results[0].datePaid.toString().split("GMT");
        let validity = results[0].validity;
        let gst = 0.09 * results[0].Amount;
        if(results[0].validity == 0){
            validity = 1;
        }
        let semiAmount = results[0].Amount/validity;
        let totalAmount = results[0].Amount + 2*gst;
    var documentDefinition = {
        header : {
            columns : [
                {text: 'KV Cable', alignment: 'left', margin: 10, fontSize: 25, bold: true},
                {text: 'INVOICE', alignment: 'right', margin: 10, fontSize: 25}
            ]
        },
        content: [
            {
              columns: [
                  {stack : [
                      {text: 'Billed to:', bold: true, margin: [0,0,0,3]},
                      `${results[0].Name}`,
                      `${results[0].Address}`,
                      `Mobile : ${results[0].Mobile}`,
                      `Stb No. : ${results[0].Stb}`,
                  ], alignment: 'left', margin: [0,50,10,0]},
                  {text: `Date: ${date[0]}`, alignment: 'right', bold: true, margin: [0,50,10,0]},
              ],


            },
		{
			table: {
				headerRows: 1,
        widths: [ 250, '*', '*', '*' ],
        heights: 20,
				body: [
            [{text: 'Description', bold: true}, {text: 'Validity', bold: true}, {text: 'Unit Price', bold: true},{text: 'Amount', bold: true}],
					['Monthly Bill Payment',`${validity}`,`${semiAmount}`,`${results[0].Amount}`],
					['','','',''],
					['','','',''],
					['','','',''],
					['','','',''],
					['','','',''],
				]
      },margin :[0,75,0,0],
			layout: 'lightHorizontalLines'
		},
            {columns : 
                [
                    {stack : [
        'Subtotal',
        'CGST',
        'SGST',
        {text : 'Total', bold: true, margin :[0,10,0,0]},
    ],  alignment: 'right',margin: [50,5,10,0]},

                    {stack : [
        `₹ ${results[0].Amount}`,
        `₹ ${gst}`,
        `₹ ${gst}`,
        {text :`₹ ${totalAmount}`, bold: true, margin :[0,10,0,0]},
    ], alignment: 'right', margin: [0,5,10,0]},
     
        ],

            }
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data)=>{
        res.writeHead(200, 
        {
            'Content-Type': 'application/pdf',
            'Content-Disposition':`attachment;filename="${results[0].Name}.pdf"`
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

    });
});


module.exports = router;
