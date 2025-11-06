const express= require('express');
const {Pool}= require('pg');

const pool = new Pool({
    user: 'elder',    // Database user
    host: 'dpg-d46din2li9vc73fc76a0-a.oregon-postgres.render.com',             // Database host (or remote IP)
    database: 'postgresone', // Database name
    password: 'kwimYjn1QxcbvEcKHXP7iMrFMjH3YZvN',     // Database password
    port: 5432,
});

 async function getAvailability(req, res){
    if(req.isAuthenticated()){
        try{
        console.log(req.body);
        const game= 'CRSC vs Diablos Rojos';
        const id= req.user.id;
        const name= req.user.first_name;
        const {Availability}= req.body;
        let update;
        
        const availabilityCheck= await pool.query('SELECT *FROM schedule_and_availability WHERE player_id= $1', [id]);
        
        if(Availability==availabilityCheck.rows[0].availability){
            res.status(200).json({message: `${name} confirmed their status as available`});
        }

        if(Availability!==availabilityCheck.rows[0].availability){
            await pool.query('UPDATE schedule_and_availability SET availability= $1 WHERE player_id= $2', [Availability, id])
            res.status(200).json({message: `${name} updated their availability status to ${Availability}`});
        }

        if(availabilityCheck.rows==0){
           await pool.query('INSERT INTO schedule_and_availability (game, availability, player_id, player_name) VALUES ($1, $2, $3, $4)', [game, Availability, id, name]);
           res.status(200).json({message: `${name}'s availability has been recorded as ${Availability}`});
        }

    }

        catch(error){
            console.log(`error occurred, no availability status was recorded or created: ${error}`)
        }
       
        
    }
    else{
        res.status(401).send('Unauthorized');
    }
        

    
};

module.exports={
    getAvailability,
};