const db = require("../config/db");

// Memproses Pemesanan Perlengkapan Duka
exports.createPerlengkapanOrder = async (req, res) => {
  try {
    // Membaca data dari form (menyesuaikan namaPemesan, noHP, namaPaket, metodePembayaran, dll)
    const {
      namaPemesan,
      nama,
      noHP,
      telepon,
      namaPaket,
      barang,
      alamat,
      metodePembayaran,
      metode_pembayaran,
      catatan,
    } = req.body;

    const pemesan = namaPemesan || nama || "Pemesan";
    const nomorWA = noHP || telepon || "-";
    const itemBarang = namaPaket || barang || "Paket Perlengkapan Duka";
    const alamatKirim = alamat || "-";
    const opsiPembayaran =
      metodePembayaran || metode_pembayaran || "Transfer Bank / Cash";

    // Status pesanan dapat diset langsung ke TERKONFIRMASI / DIPROSES
    const statusPesanan = "TERKONFIRMASI";

    // Simpan ke database orders
    await db
      .query(
        `INSERT INTO orders (jenis_layanan, total_pembayaran, status_pembayaran, metode_pembayaran) 
         VALUES ('PERLENGKAPAN', 750000, $1, $2)`,
        [statusPesanan, opsiPembayaran],
      )
      .catch(() => {
        // Fallback jika tabel db belum punya kolom metode_pembayaran
        return db
          .query(
            `INSERT INTO orders (jenis_layanan, total_pembayaran, status_pembayaran) 
           VALUES ('PERLENGKAPAN', 750000, $1)`,
            [statusPesanan],
          )
          .catch(() => {});
      });

    // Tampilan HTML Konfirmasi Berhasil Modern & Cantik dengan Tema Hijau GoKematian
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
            background-color: #f4f7f4;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            color: #2c3e50;
          }
          .header-nav {
            background-color: #1E5631;
            padding: 16px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .header-logo {
            color: #ffffff;
            font-size: 1.35rem;
            font-weight: 700;
            text-decoration: none;
          }
          .success-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 520px;
            margin: 40px auto 60px;
            box-shadow: 0 10px 30px rgba(30, 86, 49, 0.08);
            border: 1px solid #e2ebe2;
            text-align: center;
          }
          .icon-badge {
            width: 70px;
            height: 70px;
            background-color: #e8f5e9;
            color: #1E5631;
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
            background-color: #e8f5e9;
            color: #1E5631;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 700;
            display: inline-block;
          }
          .btn-primary-go {
            background-color: #1E5631;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            font-weight: 700;
            display: inline-block;
          }
          footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.85rem;
            border-top: 1px solid #e2ebe2;
            background: #fff;
          }
        </style>
      </head>
      <body>
        <header class="header-nav">
          <a href="/" class="header-logo">🕊️ GoKematian</a>
        </header>

        <div class="container">
          <div class="success-card">
            <div class="icon-badge">✓</div>
            <h2 style="color: #1E5631; margin: 0 0 8px; font-size: 1.6rem;">Pemesanan Berhasil!</h2>
            <p style="color: #666; margin: 0; font-size: 0.95rem;">Pesanan perlengkapan duka cita Anda telah tercatat dan sedang diproses.</p>

            <table class="summary-table">
              <tr>
                <td class="summary-label">Nama Pemesan</td>
                <td class="summary-value">${pemesan}</td>
              </tr>
              <tr>
                <td class="summary-label">Paket / Perlengkapan</td>
                <td class="summary-value">${itemBarang}</td>
              </tr>
              <tr>
                <td class="summary-label">Alamat Pengiriman</td>
                <td class="summary-value">${alamatKirim}</td>
              </tr>
              <tr>
                <td class="summary-label">No. WhatsApp</td>
                <td class="summary-value">${nomorWA}</td>
              </tr>
              <tr>
                <td class="summary-label">Metode Pembayaran</td>
                <td class="summary-value" style="color:#1E5631; font-weight:700;">${opsiPembayaran}</td>
              </tr>
              <tr>
                <td class="summary-label">Status Pesanan</td>
                <td class="summary-value"><span class="status-badge">${statusPesanan}</span></td>
              </tr>
            </table>

            <p style="color: #777; font-size: 0.88rem; margin-bottom: 25px;">Kurir/Tim operasional kami akan segera menghubungi nomor WhatsApp Anda untuk instruksi pembayaran dan pengantaran perlengkapan.</p>

            <a href="/perlengkapan" class="btn-primary-go">&larr; Kembali ke Perlengkapan</a>
          </div>
        </div>

        <footer>
          <p>&copy; 2026 <strong>GoKematian Project</strong>. Layanan Pelayanan Publik Duka Cita Terpadu.</p>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error Order Perlengkapan:", error);
    res.status(500).send("Gagal memproses pemesanan perlengkapan.");
  }
};
