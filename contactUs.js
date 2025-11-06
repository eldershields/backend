const {Pool}= require('pg');
const pool = new Pool({
    user: 'elder',    // Database user
    host: 'dpg-d46din2li9vc73fc76a0-a.oregon-postgres.render.com',             // Database host (or remote IP)
    database: 'postgresone', // Database name
    password: 'kwimYjn1QxcbvEcKHXP7iMrFMjH3YZvN',     // Database password
    port: 5432,
});


async function middleware(req, res){
    console.log(req.body);
    const {name, email, phone, message}= req.body;
    let id;
    const question= await pool.query('SELECT id FROM inquiries ORDER BY id DESC LIMIT 1');
    if(question.rows.length > 0){
         id= question.rows[0].id + 1;
    }

    else {
        id= 1;
    }

    const insertion= await pool.query(
      `INSERT INTO inquiries (id, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [id, name, email, phone, message]
    );

    if(insertion.rows.length > 0){
         res.status(200).json({message: "Your message was received. We will get back to you shortly. Thank you!"});

    }

    else{

         res.status(400).json({message: "Error occurred during inquiry. Please try again"});

    }

   
}

module.exports={
    middleware,
}