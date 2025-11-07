const app= require('express');
const {Pool}= require('pg');
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render gives this
  ssl: { require: true, rejectUnauthorized: false }, // Required on Render
});


async function updateInfo (req, res){
    if(req.isAuthenticated()){
        try{
            const{id}= req.user;
            const {firstname, lastname, email}= req.body;
    
        const update= await pool.query('UPDATE users SET first_name= $1, last_name= $2, email= $3 WHERE id=$4 RETURNING * ', [firstname, lastname, email, id]);
        if(update.rows[0].first_name===firstname && update.rows[0].last_name===lastname && update.rows[0].email===email){
            res.status(200).json({message:"User information has been updated !"})
        }
        else{
            res.status(400).json({message: "Error updating user info !"})
        }
         }
         catch(error){
            res.status(500).json({message: 'Error occurred:', error });
         }
        
    }
    else{
        res.json({message: 'Please Log in !'});
    }
    

}

module.exports={
    updateInfo,
}