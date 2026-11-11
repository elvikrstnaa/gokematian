const db = require("../config/db");
const path = require("path");

// 1. Menampilkan Halaman / Daftar Lahan TPU
exports.getMakamPage = async (req, res) => {
  try {
    if (req.headers["accept"] && req.headers["accept"].includes("text/html")) {
      return res.sendFile(path.join(__dirname, "../views/makam.html"));
    }

    const result = await db
      .query(
        "SELECT * FROM tpu_lahan WHERE status_petak = 'KOSONG' OR status_ketersediaan = 'TERSEDIA'",
      )
      .catch(() => ({ rows: [] }));

    res.json({
      success: true,
      tpuList: result.rows,
    });
  } catch (error) {
    res.sendFile(path.join(__dirname, "../views/makam.html"));
  }
};

// 2. Memproses Pemesanan / Booking Lahan Pemakaman dari Form
exports.createMakamOrder = async (req, res) => {
  try {
    const {
      nama,
      namaPemesan,
      namaPemohon,
      telepon,
      noHP,
      namaTPU,
      makamId,
      blok,
      blokPetak,
      namaAlmarhum,
      catatan,
    } = req.body;

    const pemesan = namaPemesan || namaPemohon || nama || "Ahli Waris";
    const nomorWA = noHP || telepon || "-";
    const tpuTujuan =
      namaTPU || (makamId ? `TPU (ID #${makamId})` : "TPU Pekanbaru");
    const petakBlok = blokPetak || blok || "-";
    const mendiang = namaAlmarhum || "-";

    // Simpan ke database orders
    await db.query(
      `INSERT INTO orders (jenis_layanan, total_pembayaran, status_pembayaran) 
       VALUES ('MAKAM', 500000, 'PENDING')`,
    );

    if (makamId) {
      await db
        .query(
          "UPDATE tpu_lahan SET status_petak = 'BOOKED' WHERE lahan_id = $1",
          [makamId],
        )
        .catch(() => {});
    }

    // Tampilan HTML Konfirmasi Berhasil Modern & Cantik
    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pemesanan Berhasil - GoKematian</title>
        <link rel="stylesheet" href="/css/style.css">
        <style>
          body {
            background-color: #f8faf8;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 0;
          }
          .success-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 520px;
            margin: 40px auto;
            box-shadow: 0 10px 30px rgba(30, 125, 50, 0.08);
            border: 1px solid #e2ece2;
            text-align: center;
          }
          .icon-badge {
            width: 70px;
            height: 70px;
            background-color: #e8f5e9;
            color: #1e7d32;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin: 0 auto 20px;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin: 25px 0;
            font-size: 0.95rem;
            background: #f9fbf9;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e8eee8;
          }
          .summary-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #eef3ee;
          }
          .summary-table tr:last-child td {
            border-bottom: none;
          }
          .summary-label {
            color: #555;
            font-weight: 500;
            width: 45%;
          }
          .summary-value {
            color: #1c2826;
            font-weight: 600;
          }
          .status-badge {
            background-color: #fff3e0;
            color: #e65100;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 700;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <!-- Header Navbar -->
        <nav class="navbar">
          <h2>🪦 GoKematian - GoMakam</h2>
          <a href="/" style="color: white; text-decoration: none; font-weight: 600; font-size: 0.95rem; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 8px;">&larr; Beranda</a>
        </nav>

        <div class="container">
          <div class="success-card">
            <div class="icon-badge">✓</div>
            <h2 style="color: #1e7d32; margin: 0 0 8px; font-size: 1.6rem;">Pemesanan Berhasil!</h2>
            <p style="color: #666; margin: 0; font-size: 0.95rem;">Reservasi lahan TPU Anda telah tercatat di sistem GoKematian.</p>

            <table class="summary-table">
              <tr>
                <td class="summary-label">Nama Pemesan</td>
                <td class="summary-value">${pemesan}</td>
              </tr>
              <tr>
                <td class="summary-label">Lokasi TPU</td>
                <td class="summary-value">${tpuTujuan}</td>
              </tr>
              <tr>
                <td class="summary-label">Petak Makam</td>
                <td class="summary-value">${petakBlok}</td>
              </tr>
              <tr>
                <td class="summary-label">Almarhum/Almarhumah</td>
                <td class="summary-value">${mendiang}</td>
              </tr>
              <tr>
                <td class="summary-label">No. WhatsApp</td>
                <td class="summary-value">${nomorWA}</td>
              </tr>
              <tr>
                <td class="summary-label">Status Pesanan</td>
                <td class="summary-value"><span class="status-badge">PENDING</span></td>
              </tr>
            </table>

            <p style="color: #777; font-size: 0.88rem; margin-bottom: 25px;">Petugas administrasi TPU akan segera menghubungi Anda untuk langkah selanjutnya.</p>

            <a href="/makam.html" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 12px 28px;">&larr; Kembali ke Daftar TPU</a>
          </div>
        </div>

        <footer>
          <p>&copy; 2026 <strong>GoKematian Project</strong>. Layanan Duka Cita Terpadu.</p>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error Order Makam:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Gagal Memproses Pemesanan</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <div style="text-align: center; padding: 50px; font-family: sans-serif;">
          <h3 style="color: red;">Gagal Memproses Pemesanan</h3>
          <p>${error.message}</p>
          <a href="/makam.html" class="btn-primary" style="display: inline-block; width: auto; padding: 10px 20px;">Kembali</a>
        </div>
      </body>
      </html>
    `);
  }
};
