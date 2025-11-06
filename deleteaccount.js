const express= require('express');
const Pool= require('pg').Pool;
const pool = new Pool({
    user: 'postgres',    // Database user
    host: 'localhost',             // Database host (or remote IP)
    database: 'postgres', // Database name
    password: '11cmortarman',     // Database password
    port: 5432,
})

async function deleteaccount(req, res){
    console.log(`the deletion path has been reached for user: ${req.user}`);

    let deletion;

    try{
    
    const id= req.user.id;
    const results= await pool.query('SELECT *FROM users WHERE id= $1', [id]);
    if(results.rows.length > 0){
       deletion= await pool.query('DELETE FROM users WHERE id= $1', [id]);
    }

    if(!deletion){
        res.status(400).json({message: 'Failure deleting user account. Please try again'});

    }
    req.session.destroy();
    res.status(200).json({message: 'Your account has been successfully deleted'}); 


    }

    catch(error){
        console.log(error);
    }
    

}
module.exports={
    deleteaccount
};