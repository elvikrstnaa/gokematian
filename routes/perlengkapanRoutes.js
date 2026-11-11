const express = require("express");
const router = express.Router();
const path = require("path");
const perlengkapanController = require("../controllers/perlengkapanController");

// Route GET: Menampilkan daftar paket perlengkapan (Bisa diakses via / atau /perlengkapan.html)
router.get(["/", "/perlengkapan.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "../views/perlengkapan.html"));
});

// Route GET: Menampilkan halaman formulir pemesanan paket
router.get(["/form", "/order", "/form-perlengkapan"], (req, res) => {
  res.sendFile(path.join(__dirname, "../views/form-perlengkapan.html"));
});

// Route POST: Memproses pesanan paket perlengkapan & menyimpan ke database / rincian pembayaran
router.post("/order", (req, res, next) => {
  // Jika kamu menggunakan Controller & Database, alihkan ke Controller:
  if (typeof perlengkapanController.createPerlengkapanOrder === "function") {
    return perlengkapanController.createPerlengkapanOrder(req, res, next);
  }

  // Fallback Tampilan Invoice & Rincian Pembayaran (Jika Controller belum siap)
  const { namaPaket, namaPemesan, noHP, alamat, metodePembayaran } = req.body;
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Bukti Pemesanan - GoKematian</title>
      <style>
        body { background: #f4f7f4; font-family: system-ui, sans-serif; padding: 40px 20px; color: #2c3e50; }
        .invoice-card { max-width: 520px; margin: 0 auto; background: white; padding: 35px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2ebe2; }
        .title { color: #1e5631; text-align: center; margin-bottom: 20px; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #c8d6c8; font-size: 0.95rem; }
        .badge-status { background: #e8f5e9; color: #1e5631; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: center; font-size: 0.9rem; border: 1px solid #c8d6c8; }
        .btn-home { display: block; width: 100%; text-align: center; background: #1e5631; color: white; padding: 13px 0; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 25px; }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <h2 class="title">🕊️ Rincian Pesanan Perlengkapan</h2>
        <div class="item"><span><strong>Nama Pemesan:</strong></span> <span>${namaPemesan || "-"}</span></div>
        <div class="item"><span><strong>No. WhatsApp:</strong></span> <span>${noHP || "-"}</span></div>
        <div class="item"><span><strong>Paket Dipesan:</strong></span> <span>${namaPaket || "-"}</span></div>
        <div class="item"><span><strong>Alamat Pengiriman:</strong></span> <span>${alamat || "-"}</span></div>
        <div class="item"><span><strong>Metode Pembayaran:</strong></span> <span style="color:#1e5631; font-weight:bold;">${metodePembayaran || "-"}</span></div>
        
        <div class="badge-status">
          <strong>Status: Pesanan Berhasil Diterima</strong><br>
          Tim armada GoKematian akan menghubungi nomor <strong>${noHP || ""}</strong> segera untuk verifikasi pengiriman & rincian pembayaran.
        </div>

        <a href="/" class="btn-home">Kembali ke Beranda Utama</a>
      </div>
    </body>
    </html>
  `);
});

// Export router di baris paling bawah
module.exports = router;
