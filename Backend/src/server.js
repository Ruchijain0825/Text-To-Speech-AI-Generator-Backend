
import "dotenv/config"
import pool from "./config/db.js";
import app from './app.js';

const PORT =  process.env.PORT||8080

const connection = async()=>
{
    try{
        await pool.query("SELECT NOW()");
        console.log("Postgre connected successfully");
        app.listen(PORT,()=>
        {
            console.log(`server is running on ${PORT}`);
        })
    }catch(error)
    {
        console.log("Database connection failed",error.message)
        process.exit(1);
    }
    
}
connection();