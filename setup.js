const { Client } = require("pg");
require("dotenv").config();

async function initDB() {
  // 1. Koneksi awal ke server PostgreSQL untuk membuat Database
  const client = new Client({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: String(process.env.DB_PASSWORD || ""),
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log("🔄 Menghubungkan ke PostgreSQL...");

    // Buat Database jika belum ada
    await client.query("CREATE DATABASE gokematian");
    console.log('✅ Database "gokematian" berhasil dibuat!');
  } catch (err) {
    if (err.code === "42P04") {
      console.log('ℹ️ Database "gokematian" sudah ada.');
    } else {
      console.log("⚠️ Info DB:", err.message);
    }
  } finally {
    await client.end();
  }

  // 2. Koneksi ke Database gokematian untuk membuat Tabel
  const pool = require("./config/db");
  try {
    console.log("🔄 Membuat tabel orders & ambulans...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        jenis_layanan VARCHAR(50),
        total_pembayaran INT,
        status_pembayaran VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ambulans (
        ambulans_id SERIAL PRIMARY KEY,
        nama_driver VARCHAR(100),
        status_ketersediaan VARCHAR(20) DEFAULT 'TERSEDIA'
      );
    `);

    console.log("✅ Tabel orders & ambulans berhasil dibuat!");
  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err.message);
  } finally {
    process.exit();
  }
}

initDB();
