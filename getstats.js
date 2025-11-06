
const {Pool}= require('pg');
const pool = new Pool({
    user: 'elder',    // Database user
    host: 'dpg-d46din2li9vc73fc76a0-a.oregon-postgres.render.com',             // Database host (or remote IP)
    database: 'postgresone', // Database name
    password: 'kwimYjn1QxcbvEcKHXP7iMrFMjH3YZvN',     // Database password
    port: 5432,
});

async function getstats(req, res) {
    if(req.isAuthenticated()){
        try{
          const id= req.user.id;
          console.log(`The id that appeared in the getstats function is ${id}`);
          const results= await pool.query('SELECT *FROM stats WHERE player_id= $1', [id]);
          if(results.rows.length === 0){
         res.status(400).json({message: 'request from the database came back empty'});
         }
         console.log(`the stats are ${JSON.stringify(results.rows[0])}`);
         res.status(200).json(results.rows[0]);
        }
        catch(error){
            console.log(`unexpected error ${error} occurred`);
            res.status(500).send(`error occurred ${error}`);
        }
    }
}

module.exports={
    getstats,
};
