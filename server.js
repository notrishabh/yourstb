const express = require('express');
const app = express();
const bodyparser = require('body-parser');
port = process.env.PORT || 8000;
const mysql = require('mysql');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


require('./config/passport-config')(passport); //Passport Login location

app.use(bodyparser.urlencoded({
    extended : true
}));
app.use(bodyparser.json()); //Body Parser for req.body

app.set('view engine', 'ejs'); //EJS Configuration
app.use( express.static( "public" ) );

//============Database Connection==============
db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'ccn'
});

db.connect((err)=>{
    if(!err){
        console.log("Database Connected");
    }
});
//==============================================


//=================Passport Login Configuration========
app.use(session({
    secret : 'secret',
    cookie : { maxAge : 86400000},
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//=====================================================

PaytmConfig = {
	mid: "MvRloZ65975295905696",
	key: "F5PAgH3S9@Qsx51W",
	website: "WEBSTAGING"
}




//ROUTES



app.use('/adminPanel', require('./routes/admin'));
app.use('/payments', require('./routes/payments'));
app.use('/customerPanel', require('./routes/customer'));
app.use('/adminLogin', require('./routes/adminLogin'));
app.use('/', require('./routes/customerLogin'));

//Server Connection
app.listen(port, ()=>{
    console.log("Server Connected");
});