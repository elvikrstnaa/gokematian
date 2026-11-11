const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "gokematian",
  database: process.env.DB_NAME || "gokematian",
  password: String(process.env.DB_PASSWORD || ""),
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
