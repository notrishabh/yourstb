const express = require('express');
const route = express.Router();


var PaytmConfig = {
	mid: "MvRloZ65975295905696",
	key: "F5PAgH3S9@Qsx51W",
	website: "WEBSTAGING"
}

route.get('/customerPanel/txn', function(request, response){
    response.render("txn", {qs : request.query});
});

route.post('/customerPanel/txn', function(req, res){
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
        route.post('/callback', function(req, res){
        if(req.url == '/callback')
        {
        // case "/callback":
        res.render('aftercallback.ejs');
        res.end();
    }
});