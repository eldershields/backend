const app= require('express');
const {Pool}= require('pg');
const pool = new Pool({
    user: 'elder',    // Database user
    host: 'dpg-d46din2li9vc73fc76a0-a.oregon-postgres.render.com',             // Database host (or remote IP)
    database: 'postgresone', // Database name
    password: 'kwimYjn1QxcbvEcKHXP7iMrFMjH3YZvN',     // Database password
    port: 5432,
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