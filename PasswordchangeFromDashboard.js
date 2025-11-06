const express= require('express');
const {Pool}= require('pg');
const bcrypt= require('bcrypt');
const passport = require('passport');

const pool= new Pool({
    user: 'postgres',    // Database user
    host: 'localhost',             // Database host (or remote IP)
    database: 'postgres', // Database name
    password: '11cmortarman',     // Database password
    port: 5432,
});

async function changePasswordFromDashboard (req, res){
    if (req.isAuthenticated()){
        try{
            const{id}=req.user;
            const{password, newpassword}= req.body;
            const currentPassword= await pool.query('SELECT password FROM users WHERE id= $1 ', [id]);
            const response= await bcrypt.compare(password, currentPassword.rows[0].password);
            
            if(response){
                const saltRounds= 10;
                const salt= await bcrypt.genSalt(saltRounds);
                const hash= await bcrypt.hash(newpassword, salt);
                await pool.query('UPDATE users SET password= $1 WHERE id= $2' , [hash, id]);
            }
            else{
                res.status(400).json({message: `The 'current password' you entered does not match the one on file`});
            }
            const checkPasswordUpdate= await pool.query('SELECT password FROM users WHERE id= $1 ', [id]);
            const responsetwo= await bcrypt.compare(newpassword, checkPasswordUpdate.rows[0].password);
            if(responsetwo){
                res.status(200).json({message: "Password was successfully changed"});
            }
            else{
                res.status(400).json({message: 'password was not changed. Please try again'});
            }
        }
        catch(error){
            res.status(500).json({message: `Error occurred ! ${error}`});
        }
    }
};


module.exports={
    function: changePasswordFromDashboard,
};