const Pool= require('pg').Pool;
const bcrypt= require('bcrypt');

const pool= new Pool({
    user: 'postgres',    // Database user
    host: 'localhost',             // Database host (or remote IP)
    database: 'postgres', // Database name
    password: '11cmortarman',     // Database password
    port: 5432,
});

async function credentialValidation(req, res){
    console.log(req.body);
    const {firstname, lastname, email}= req.body;
    const validateCredentials= await pool.query('SELECT *FROM users WHERE email= $1', [email]);
    if(validateCredentials.rows.length === 0){
        res.json({message: 'No user found with those credentials'});
    }
    if(validateCredentials.rows[0].first_name === firstname && validateCredentials.rows[0].last_name === lastname){
            res.status(200).json({message:'change your password now'})
        }
};


module.exports={
    credentialValidation,
}