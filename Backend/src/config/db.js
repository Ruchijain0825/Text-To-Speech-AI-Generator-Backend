import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRE_URL,

  max: 10,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 5000,
});

pool.connect()
  .then(async (client) => {
    try {
      const result = await client.query(`
        SELECT
          current_database() AS database,
          current_schema() AS schema
      `);

      console.log("DATABASE:", result.rows[0]);

      const tables = await client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name IN ('dbusers', 'conversations')
        ORDER BY table_name
      `);

      console.log("TABLES:", tables.rows);

    } finally {
      client.release();
    }
  })
  .catch((error) => {
    console.error("DATABASE CONNECTION ERROR:", error.message);
  });

export default pool;