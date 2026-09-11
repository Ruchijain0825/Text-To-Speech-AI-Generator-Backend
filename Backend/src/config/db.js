import pg from "pg"
const {Pool} = pg;
const pool = new Pool({
    connectionString:process.env.POSTGRE_URL,
    max:10,
    idleTimeoutMillis:3000,
    connectionTimeoutMillis:5000,

})
export default pool;