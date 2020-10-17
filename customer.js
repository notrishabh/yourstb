var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var qs = require("querystring");
var nodemailer = require("nodemailer");
var app = express();

const http = require('http');
const https = require('https');
const checksum_lib = require('./checksum.js');
const port = 3000;



const adminController = require('./routes/admin');

// app.use('/',adminController);

// let transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	secure: false,
// 	port: 3030,
// 	auth: {
// 		user: 'rishabh.facebook@gmail.com',
// 		pass: 'rrclub107'
// 	},
// 	tls: {
// 		rejectUnauthorized: false
// 	}
// });
// let HelperOptions = {
// 	from: '"Rishabh Chauhan" <notthecorrect@gmail.com',
// 	to: 'rishabh.facebook@gmail.com',
// 	subject: 'SUP NIGG',
// 	text: 'damn boiiiii'
// };
// transporter.sendMail(HelperOptions, (error, info) => {
// 	if(error){
// 		return console.log(error);
// 	}
// 	console.log("SENT MSG");
// 	console.log(info);
// });
var PaytmConfig = {
	mid: "MvRloZ65975295905696",
	key: "F5PAgH3S9@Qsx51W",
	website: "WEBSTAGING"
}



app.set('view engine', 'ejs');

var urlEncodedParser = bodyParser.urlencoded({extended : true});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'main'
});

//********************************************* */


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(urlEncodedParser);
app.use(bodyParser.json());

//********************************************* */

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/index.html', function(request, response){
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/admin.html', function(request, response){
    response.sendFile(path.join(__dirname + '/admin.html'));
});

//********************************************* */

app.get('/payment.html', function(request, response){
// 	var reo = '<html><head><title>Payment Records</title><style>body{color: red;}table{border-collapse: collapse; width: 100%}th{height: 50px; background-color: green; color: white;}td,th{text-align: left; padding: 15px;}</style></head><body>{${table}}</body></html>';
// 	function setResHtml(sql,cb) {
// 	connection.query(sql, function(error, results, fields) {

// 	var table = "";
// 	for(var i=0; i<results.length; i++)
// 	{
// 		table +='<tr><td>' + (i+1) + '</td><td>' + results[i].Name + '</td><td>' + results[i].Address + '</td><td>' + results[i].Mobile + '</td><td>' + results[i].Stb + '</td><td>' + results[i].Amount + '</td><td>' + results[i].Date + '</td><td>' + results[i].Time + '</td></tr>';
// 	}
// 	table = '<table border="1"><tr><th>Nr.</th><th>Name</th></th><th>Address</th><th>Mobile</th></th><th>Stb No.</th></th><th>Amount</th><th>Date</th><th>Time</th></tr>' + table + '</table'; 
// 	return cb(table);
// });

// 	}
// 	let sql = 'SELECT * FROM payment';

// 	setResHtml(sql, resql=> {
// 		reo = reo.replace('{${table}}', resql);
// 		response.writeHead(200, {'Content-Type' : "text\html; charset=utf-8"});
// 		response.write(reo, 'utf-8');
// 		response.end();
// 	});
	connection.query('SELECT * FROM payment', function(error,rows,fields){
		response.render('payment.ejs',{data:rows});
	});
});


app.get('/complaint.html', function(request, response){
// 	var reo = '<html><head><title>Complaint Records</title><style>body{color: red;}table{border-collapse: collapse; width: 100%}th{height: 50px; background-color: green; color: white;}td,th{text-align: left; padding: 15px;}.notPressed:focus{width : 50px;}</style></head><body>{${table}}</body></html>';
// 	function setResHtml(sql,cb) {
// 	connection.query(sql, function(error, results, fields) {

// 	var table = "";
// 	for(var i=0; i<results.length; i++)
// 	{
// 		table +='<tr><td><input type="button" class="notPressed"></td><td>' + results[i].Name + '</td><td>' + results[i].Address + '</td><td>' + results[i].Mobile + '</td><td>' + results[i].Stb + '</td><td>' + results[i].Mail + '</td><td>' + results[i].Error + '</td><td>' + results[i].Msg + '</td></tr>';
// 	}
// 	table = '<table border="1"><tr><th>Nr.</th><th>Name</th></th><th>Address</th><th>Mobile</th></th><th>Stb No.</th></th><th>Mail</th><th>Error</th><th>Message</th></tr>' + table + '</table'; 
// 	return cb(table);
// });

// 	}
// 	let sql = 'SELECT * FROM complaint';

// 	setResHtml(sql, resql=> {
// 		reo = reo.replace('{${table}}', resql);
// 		response.writeHead(200, {'Content-Type' : "text\html; charset=utf-8"});
// 		response.write(reo, 'utf-8');
// 		response.end();
// 	});

	connection.query('SELECT * FROM complaint WHERE Checkbox="0"', function(error,rows,fields){
	response.render('complaint.ejs',{data:rows});
});
app.post('/check', urlEncodedParser, function(request, response){
	var lol = request.body.checklol;
	console.log(lol);
	if(lol === 'on'){
		connection.query('UPDATE complaint SET Checkbox = "1"',function(error, rows, fields){
		});
	}
});
});


app.get('/full.html', function(request, response){
// 	var reo = '<html><head><title>Complaint Records</title><style>body{color: red;}table{border-collapse: collapse; width: 100%}th{height: 50px; background-color: green; color: white;}td,th{text-align: left; padding: 15px;}</style></head><body>{${table}}</body></html>';
// 	function setResHtml(sql,cb) {
// 	connection.query(sql, function(error, results, fields) {

// 	var table = "";
// 	for(var i=0; i<results.length; i++)
// 	{
// 		table +='<tr><td>' + (i+1) + '</td><td>' + results[i].Name + '</td><td>' + results[i].Address + '</td><td>' + results[i].Mobile + '</td><td>' + results[i].Stb + '</td></tr>';
// 	}
// 	table = '<table border="1"><tr><th>Nr.</th><th>Name</th></th><th>Address</th><th>Mobile</th></th><th>Stb No.</th></tr>' + table + '</table'; 
// 	return cb(table);
// });

// 	}
// 	let sql = 'SELECT * FROM info';

// 	setResHtml(sql, resql=> {
// 		reo = reo.replace('{${table}}', resql);
// 		response.writeHead(200, {'Content-Type' : "text\html; charset=utf-8"});
// 		response.write(reo, 'utf-8');
// 		response.end();
// 	});

	connection.query('SELECT * FROM info', function(error,rows,fields){
	response.render('full.ejs',{data:rows});
});
});




//********************************************* */


app.get('/customer.html', function(request, response){
    response.sendFile(path.join(__dirname + '/customer.html'));
});



app.post('/auth', urlEncodedParser, function(request, response){
    var stb = request.body.stb;
    if(stb)
    {
        connection.query('SELECT * FROM info WHERE Stb = ?', [stb], function(error, results, fields) {
            if(results.length > 0){
                request.session.loggedin = true;
                request.session.stb = stb;
                var data = {stbb : results[0].Stb, name : results[0].Name, address : results[0].Address, mobile : results[0].Mobile, june : results[0].June, july : results[0].July};

                response.render('panel.ejs', {data});
            }
            else {
                response.send('Incorrect Stb no.');
            }
            response.end();
        });
    } else {
        response.send('Please enter STB no.');
        response.end();
    }
});

app.post('/send', urlEncodedParser, function(request, response){
	var stbb = request.body.stb;
	response.send("Complaint Sent!");
	var mail = request.body.mail;
	var wow = request.body.error;
	var msg = request.body.msg;
	connection.query('SELECT * FROM info WHERE Stb = ?', [stbb], function(error, results, fields) {
		var complaint = 'INSERT INTO complaint SET ?';
		var values = {Name : results[0].Name, Address : results[0].Address, Mobile : results[0].Mobile, Stb : results[0].Stb, Mail : mail, Error : wow, Msg : msg};
		connection.query(complaint, values, function(err, results, fields){
		});
	});
});


//********************************************* */


// http.createServer(function (req, res) {

    app.get('/txn.html', function(request, response){
		response.render("txn.ejs", {qs : request.query});
    });

    app.post('/txn', urlEncodedParser, function(req, res){
		var stb = req.body.stb.split(".");
		var stbb = stb[1];
        var phn = req.body.phn;
        var amount = req.body.amount;
        if(req.url == "/txn"){
			// case "/":
				var params 						= {};
				params['MID'] 					= PaytmConfig.mid;
				params['WEBSITE']				= PaytmConfig.website;
				params['CHANNEL_ID']			= 'WEB';
				params['INDUSTRY_TYPE_ID']	= 'Retail';
				params['ORDER_ID']			= 'TEST_'  + new Date().getTime();
				params['CUST_ID'] 			= 'Customer001';
				params['TXN_AMOUNT']			= amount;
				params['CALLBACK_URL']		= 'http://localhost:'+port+'/callback';
				params['EMAIL']				= 'abc@mailinator.com';
				params['MOBILE_NO']			= phn;
	
				checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
	
					var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
					// var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
					
					var form_fields = "";
					for(var x in params){
						form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"' >";
					}
					form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";
	
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit();</script></body></html>');
					res.end();
				});
			// break;
			connection.query('SELECT * FROM info WHERE Stb = ?', [stbb], function(error, results, fields, amount) {
				// var date = NOW();
				// var time = NOW();
				var pay = 'INSERT INTO payment SET ?';
				var values = {Name : results[0].Name, Address : results[0].Address, Mobile : results[0].Mobile, Stb : results[0].Stb, Amount : req.body.amount};
				connection.query(pay, values, function(err, results, fields){
				});
			});
		}	
		});
			app.post('/callback', urlEncodedParser, function(req, res){
			if(req.url == '/callback')
			{
			// case "/callback":
			res.render('aftercallback.ejs');
			res.end();
	
				// var body = '';
				
				// req.on('data', function (data) {
				// 	body += data;
				// });
	
				// req.on('end', function () {
				// 	var html = "";
				// 	var post_data = qs.parse(body);
	
	
				// 	// received params in callback
				// 	console.log('Callback Response: ', post_data, "\n");
				// 	html += "<b>Callback Response</b><br>";
				// 	for(var x in post_data){
				// 		html += x + " => " + post_data[x] + "<br/>";
				// 	}
				// 	html += "<br/><br/>";
	
	
				// 	// verify the checksum
				// 	var checksumhash = post_data.CHECKSUMHASH;
				// 	// delete post_data.CHECKSUMHASH;
				// 	var result = checksum_lib.verifychecksum(post_data, PaytmConfig.key, checksumhash);
				// 	console.log("Checksum Result => ", result, "\n");
				// 	html += "<b>Checksum Result</b> => " + (result? "True" : "False");
				// 	html += "<br/><br/>";
	
	
	
				// 	// Send Server-to-Server request to verify Order Status
				// 	var params = {"MID": PaytmConfig.mid, "ORDERID": post_data.ORDERID};
	
				// 	checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
	
				// 		params.CHECKSUMHASH = checksum;
				// 		post_data = 'JsonData='+JSON.stringify(params);
	
				// 		var options = {
				// 			hostname: 'securegw-stage.paytm.in', // for staging
				// 			// hostname: 'securegw.paytm.in', // for production
				// 			port: 443,
				// 			path: '/merchant-status/getTxnStatus',
				// 			method: 'POST',
				// 			headers: {
				// 				'Content-Type': 'application/x-www-form-urlencoded',
				// 				'Content-Length': post_data.length
				// 			}
				// 		};
	
	
				// 		// Set up the request
				// 		var response = "";
				// 		var post_req = https.request(options, function(post_res) {
				// 			post_res.on('data', function (chunk) {
				// 				response += chunk;
				// 			});
	
				// 			post_res.on('end', function(){
				// 				console.log('S2S Response: ', response, "\n");
	
				// 				var _result = JSON.parse(response);
				// 				html += "<b>Status Check Response</b><br>";
				// 				for(var x in _result){
				// 					html += x + " => " + _result[x] + "<br/>";
				// 				}
	
				// 				res.writeHead(200, {'Content-Type': 'text/html'});
				// 				res.write(html);
				// 				res.end();
				// 			});
				// 		});
	
				// 		// post the data
				// 		post_req.write(post_data);
				// 		post_req.end();
				// 	});
				// });
				
			// break;
		}
});
app.listen(port);