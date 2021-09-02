const express = require("express");
const router = express.Router();

const pdfMake = require("../pdfmake/pdfmake");
const vfsFonts = require("../pdfmake/vfs_fonts");

const mysql = require("mysql");
const { ensureAuthenticateds } = require("../config/adminAuth"); //Login Authenticator

pdfMake.vfs = vfsFonts.pdfMake.vfs;

//PDF making comment
router.get("/:id/pdf", ensureAuthenticateds, (req, res, next) => {
    //res.send('PDF');
    let id = req.params.id;
    let sql = `SELECT * FROM all_payment WHERE id = ${id}`;
    db.query(sql, (err, results) => {
        let date = results[0].datePaid.toString().split("GMT");
        let validity = results[0].validity;
        let gst = 0.09 * results[0].Amount;
        if (results[0].validity == 0) {
            validity = 1;
        }
        let totalAmount = results[0].Amount - 2 * gst;
        let semiAmount = totalAmount / validity;
        var documentDefinition = {
            header: {
                text: "INVOICE",
                alignment: "center",
                margin: [0, 10, 0, 0],
            },
            content: [
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "KV Cable",
                                    bold: true,
                                    margin: [0, 0, 0, 5],
                                },
                                "H. No. 7/211 Geeta Colony, Delhi-110031",
                                "GSTIN : 07ABMPC5563H1ZL",
                            ],
                            alignment: "left",
                        },
                        {
                            text: "KV CABLE",
                            fontSize: 30,
                            alignment: "right",
                        },
                    ],
                },
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "Billed to:",
                                    bold: true,
                                    margin: [0, 0, 0, 3],
                                },
                                `${results[0].Name}`,
                                `${results[0].Address}`,
                                `Mobile : ${results[0].Mobile}`,
                                `Stb No. : ${results[0].Stb}`,
                            ],
                            alignment: "left",
                            margin: [0, 50, 10, 0],
                        },
                        {
                            stack: [
                                {
                                    text: `Date: ${date[0]}`,
                                },
                                {
                                    text: `Invoice No.  : ${results[0].id}`,
                                    bold: true,
                                    margin: [0, 10, 0, 0],
                                },
                            ],
                            alignment: "right",
                            margin: [0, 50, 0, 0],
                        },
                    ],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [250, "*", "*", "*"],
                        heights: [20, 100, 20, 20, 40],
                        body: [
                            [
                                { text: "Description", bold: true },
                                { text: "Validity", bold: true },
                                { text: "Unit Price", bold: true },
                                { text: "Amount", bold: true },
                            ],
                            [
                                "Monthly Bill Payment",
                                `${validity}`,
                                `${semiAmount}`,
                                `${totalAmount}`,
                            ],
                            ["CGST @ 9%", "", "", `₹  ${gst}`],
                            ["SGST @ 9%", "", "", `₹  ${gst}`],
                            [
                                { text: "Total", bold: true },
                                "",
                                "",
                                {
                                    text: `₹  ${results[0].Amount}`,
                                    bold: true,
                                },
                            ],
                        ],
                    },
                    margin: [0, 75, 10, 0],
                    //layout: "lightHorizontalLines",
                },
            ],
        };

        const pdfDoc = pdfMake.createPdf(documentDefinition);
        pdfDoc.getBase64((data) => {
            res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment;filename="KV_Cable_INV.pdf"`,
            });

            const download = Buffer.from(data.toString("utf-8"), "base64");
            res.end(download);
        });
    });
});

module.exports = router;
