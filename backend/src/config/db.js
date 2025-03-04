import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PG_PORT,
});

async function connectDb() {
  try {
    await pool.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error", error);
  }
}

connectDb();

export default pool;
