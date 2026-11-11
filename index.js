const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 80;

// Import Routes Fitur
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const makamRoutes = require("./routes/makamRoutes");
const perlengkapanRoutes = require("./routes/perlengkapanRoutes");
const administrasiRoutes = require("./routes/administrasiRoutes");

// Middleware Body Parser & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mengaktifkan Folder Statis
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// 1. Rute Beranda Utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 2. Rute GET Halaman Konsultasi (Mendukung /konsultasi dan /konsultasi.html)
app.get(["/konsultasi", "/konsultasi.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "views", "konsultasi.html"));
});

// 3. Rute POST Pengiriman Form Konsultasi
app.post("/konsultasi/kirim", (req, res) => {
  const { nama, no_hp, topik } = req.body;
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Konsultasi Terkirim</title>
      <style>
        body { background: #f4f7f4; font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; max-width: 480px; }
        h2 { color: #1e5631; margin-bottom: 15px; }
        p { color: #555; line-height: 1.6; }
        a { display: inline-block; margin-top: 20px; background: #1e5631; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>🕊️ Lembar Konsultasi Terkirim!</h2>
        <p>Terima kasih <strong>${nama}</strong>. Formulir bantuan Anda mengenai <em>"${topik}"</em> telah diterima. Tim kami akan segera menghubungi WhatsApp <strong>${no_hp}</strong>.</p>
        <a href="/">Kembali ke Beranda</a>
      </div>
    </body>
    </html>
  `);
});

// Pendaftaran Router Sub-Fitur
app.use("/ambulance", ambulanceRoutes);
app.use("/makam", makamRoutes);
app.use("/perlengkapan", perlengkapanRoutes);
app.use("/administrasi", administrasiRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server GoKematian berjalan di http://localhost:${PORT}`);
});
