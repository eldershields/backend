const express= require('express');
const app= express();
const PORT= 5000;
const cors= require('cors');
const bodyParser= require('body-parser');
const importedModule= require('./registration');
const importedModuleTwo= require('./deleteaccount');
const importedModuleForStats= require('./getstats');
const passport= require('passport');
const localStrategy= require('passport-local').Strategy;
const session= require('express-session');
const bcrypt= require('bcrypt');
const Pool= require('pg').Pool;
const importedModuleForAvailability= require('./getAvailability');
const importedModuleForPasswordChangeFromDashboard= require('./PasswordchangeFromDashboard');
const importedModuleForInfoUpdate= require('./personalInfoUpdate');
const importedFromContactUs= require('./contactUs');
const importedmodulefromPasswordChange= require('./passwordchange');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render gives this
  ssl: { require: true, rejectUnauthorized: false }, // Required on Render
});





app.use(cors(
    {
        origin: ['https://client-0mhf.onrender.com','https://backend-rvpe.onrender.com'],
        credentials: true,
    }
));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));




app.use(session({
    secret: '11cmortarman',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // If using HTTP, set to false; if using HTTPS, set to true
        httpOnly: true,  // This ensures cookies are only accessible through HTTP requests, not JavaScript
        maxAge: 24 * 60 * 60 * 1000  // Session expires after 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session()); 

passport.use( new localStrategy(async function login(username, password, done){

    console.log(username);
    
    const usernameQuery= await pool.query('SELECT *FROM users WHERE username= $1', [username]);
    if(usernameQuery.rows.length===0){
        return done(null, false, {message: 'Username could not be found in the system'});
    }
    const compare= await bcrypt.compare(password, usernameQuery.rows[0].password);
    if(!compare){
        return done(null, false, {message: 'You have entered the wrong password'});
       
    }
    else{
        console.log(usernameQuery.rows[0]);
        return done(null, usernameQuery.rows[0]);

    }

}
)
)


passport.serializeUser((user, done)=>{
    return done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    
    const findIdsUser= await pool.query('SELECT *FROM users WHERE id= $1', [id]);
    return done(null, findIdsUser.rows[0]);
})



app.post('/registration', importedModule.register);


app.post('/login', passport.authenticate('local', {
    successRedirect: 'https://client-0mhf.onrender.com/dashboard',
    failureRedirect: 'https://client-0mhf.onrender.com',
})); 

app.post('/availability', importedModuleForAvailability.getAvailability);

app.post('/passwordchange', importedmodulefromPasswordChange.credentialValidation);

app.post('/dashboardpasswordchange', importedModuleForPasswordChangeFromDashboard.function );

app.post('/infoupdate', importedModuleForInfoUpdate.updateInfo);

app.post('/inquiry', importedFromContactUs.middleware);

app.get('/dashboard', async(req, res)=>{
    
    if(req.isAuthenticated()){
        console.log(req.session);
    
        
        const userCredentials= await pool.query('SELECT *FROM users WHERE id= $1 ', [req.user.id]);
        console.log(userCredentials.rows[0]);
        res.json(userCredentials.rows[0]);
    }

    else{
        res.redirect('https://client-0mhf.onrender.com');
    }
   

})

app.get('/stats', importedModuleForStats.getstats);





app.delete('/logout', (req, res)=>{
    console.log('you are trying to log out');
    console.log(`before log out session is: ${JSON.stringify(req.session)}`);
    
    req.logout((error)=>{
        if(error){
            res.status(400).json({message: 'Error occurred during logout process'})
        }
        req.session.destroy((error)=>{
            if(error){
                res.send('error destroying the session');
            }
            res.clearCookie('Connect.sid');  
            console.log(`after log out, session is: ${JSON.stringify(req.session)}`);

        });
        
        res.status(200).json({message: 'User has been successfully logged out!'});
    })
    
    
    
})

        

app.delete('/delete', importedModuleTwo.deleteaccount );

app.listen(PORT, ()=>{
    console.log('you are now connected on port 5000');
})
