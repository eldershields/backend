
const {Pool}= require('pg');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render gives this
  ssl: { require: true, rejectUnauthorized: false }, // Required on Render
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
