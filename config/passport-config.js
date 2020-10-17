const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');

module.exports = function(passport){
    passport.use('admin-local',
        new LocalStrategy({usernameField : 'username'}, (username, password, done) => {
            //Match username
            let sql = `SELECT * FROM admin_login WHERE username = "${username}" LIMIT 1`;   //Matching Criteria
            db.query(sql, (err, result)=>{
                if(result.length == 0){
                    return done(null, false, {message : "Not registered username."});
                }else{
                    if(password == result[0].password){
                        return done(null, result[0]);
                    }else{
                        return done(null, false, {message : "Wrong password"});
                    }
                }
            });
        })
    );


    passport.use('customer-local',
    new LocalStrategy({usernameField : 'stbNumber', passwordField: 'stbNumber',}, (stbNumber,password, done) => {
        //Match stbnumber
        let sql = `SELECT * FROM all_info WHERE Stb = "${stbNumber}" LIMIT 1`;   //Matching Criteria
        db.query(sql, (err, results)=>{
            if(results.length == 0){
                console.log("fuck");
                return done(null, false, {message : "No STB found."});
            }else{
                console.log(results[0]);
                return done(null, results[0]);
            }
        });
    })
);

passport.serializeUser((user,done)=> {
    if(user.id){
        done(null, user.id);
    }else{
        done(null, user.Stb);
    }
        
});
passport.deserializeUser((id, done)=> {
    if(id < 100){
        db.query(`SELECT * FROM admin_login WHERE id = ${id}`, (err, result)=>{
            done(null, result[0]);
        });
    }else{
        db.query(`SELECT * FROM all_info WHERE Stb = ${id}`, (err, result)=>{
            done(null, result[0]);
        });
    }

});
}