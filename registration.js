const bcrypt = require('bcrypt');
const { response } = require('express');
const Pool= require('pg').Pool;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render gives this
  ssl: { require: true, rejectUnauthorized: false }, // Required on Render
});


async function register(req, res) {
    console.log(req.body);
    try {
        const { firstname, lastname, email, username, password } = req.body;
        const checkForEmail= await pool.query('SELECT * FROM users WHERE email= $1', [email]);

        if(checkForEmail.rows.length > 0){
            return res.json({message:'This email is already in use'});
        }

        const checkForUsername= await pool.query('SELECT *FROM users WHERE username= $1', [username]);

        if (checkForUsername.rows.length > 0){
           return  res.json({message:"Username already in Use. Please choose a different one."});
        }
        let id;
        const checkForId = await pool.query('SELECT *FROM users ORDER BY ID DESC LIMIT 1');
        if (checkForId.rows.length === 0) {
            id = 1;
        }
        else {
            id = checkForId.rows[0].id + 1;
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = await pool.query('INSERT INTO users(id, first_name, last_name, email, username, password ) VALUES($1, $2, $3, $4, $5, $6) RETURNING*;', [id, firstname, lastname, email, username, hashedPassword]);
        if(insertQuery.rows.length > 0){
        return res.status(200).json({message: 'user registered in PG'});
        }
    
    }
    catch (error) {
        res.status(500).json({error:`Error occurred ${error}`});
        console.log('error occurred ! here are the results: ', error);
    }


}

module.exports={
    register,
}