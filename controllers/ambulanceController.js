const db = require("../config/db");

// Memproses Pemesanan Ambulans
exports.createOrder = async (req, res) => {
  try {
    const {
      namaPemesan,
      nama,
      telepon,
      noHP,
      jemput,
      alamatJemput,
      pickup,
      tujuan,
      alamatTujuan,
      destination,
    } = req.body;

    // Menampung variasi variabel dari Form / JSON Body
    const pemesan = namaPemesan || nama || "Pemesan";
    const nomorHP = telepon || noHP || "-";
    const lokasiJemput = jemput || alamatJemput || pickup || "-";
    const lokasiTujuan = tujuan || alamatTujuan || destination || "-";
    const statusPesanan = "TERKONFIRMASI";

    // 1. Simpan data ke tabel pemesanan_ambulans di Supabase
    const queryText = `
      INSERT INTO pemesanan_ambulans (nama_pemesan, no_hp, lokasi_penjemputan, lokasi_tujuan, status)
      VALUES ($1, $2, $3, $4, 'Mencari Driver')
      RETURNING *
    `;
    const queryParams = [pemesan, nomorHP, lokasiJemput, lokasiTujuan];

    let result;
    try {
      result = await db.query(queryText, queryParams);
    } catch (dbErr) {
      console.warn(
        "Gagal simpan ke pemesanan_ambulans, mencobakan fallback orders...",
        dbErr.message,
      );
      // Fallback opsional ke tabel orders jika ada
      await db
        .query(
          `INSERT INTO orders (jenis_layanan, total_pembayaran, status_pembayaran) 
         VALUES ('AMBULANCE', 250000, $1)`,
          [statusPesanan],
        )
        .catch(() => {});
    }

    // 2. Jika request datang dari AJAX/fetch (headers Accept application/json)
    if (req.headers["content-type"] === "application/json" || req.xhr) {
      return res.status(200).json({
        success: true,
        message: "Pemesanan ambulans berhasil dikirim!",
        data: result
          ? result.rows[0]
          : { nama_pemesan: pemesan, status: statusPesanan },
      });
    }

    // 3. Jika submit form HTML biasa (Server-Side Rendered HTML Response)
    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pemesanan Ambulans Berhasil - GoKematian</title>
        <link rel="stylesheet" href="/css/style.css">
        <style>
          body {
            background-color: #f4f7f4;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .header-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ffffff;
            font-size: 1.35rem;
            font-weight: 700;
            text-decoration: none;
          }

          .header-badge {
            background: rgba(255, 255, 255, 0.15);
            color: #ffffff;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s;
          }

          .header-badge:hover {
            background: rgba(255, 255, 255, 0.25);
          }

          .success-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 45px 35px;
            max-width: 520px;
            margin: 50px auto 70px;
            box-shadow: 0 12px 30px rgba(30, 86, 49, 0.08);
            border: 1px solid #e2ebe2;
            text-align: center;
          }

          .icon-badge {
            width: 76px;
            height: 76px;
            background-color: #e8f5e9;
            color: #1E5631;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 38px;
            margin: 0 auto 22px;
            box-shadow: 0 4px 12px rgba(30, 86, 49, 0.1);
          }

          .card-title {
            color: #1E5631;
            margin: 0 0 10px;
            font-size: 1.7rem;
            font-weight: 800;
          }

          .card-subtitle {
            color: #666666;
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .summary-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin: 28px 0;
            font-size: 0.95rem;
            background: #f9fbf9;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid #e8eee8;
          }

          .summary-table td {
            padding: 14px 18px;
            border-bottom: 1px solid #eef3ee;
          }

          .summary-table tr:last-child td {
            border-bottom: none;
          }

          .summary-label {
            color: #555555;
            font-weight: 500;
            width: 42%;
          }

          .summary-value {
            color: #2c3e50;
            font-weight: 700;
          }

          .status-badge {
            background-color: #e8f5e9;
            color: #1E5631;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 800;
            display: inline-block;
            letter-spacing: 0.5px;
          }

          .btn-primary-go {
            background-color: #1E5631;
            color: #ffffff;
            text-decoration: none;
            padding: 13px 32px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.95rem;
            display: inline-block;
            transition: background 0.2s, transform 0.1s;
          }

          .btn-primary-go:hover {
            background-color: #174426;
          }

          .btn-primary-go:active {
            transform: scale(0.99);
          }

          footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 0.85rem;
            border-top: 1px solid #e2ebe2;
            background: #ffffff;
          }
        </style>
      </head>
      <body>

        <!-- Header Navbar -->
        <header class="header-nav">
          <a href="/" class="header-logo">
            <span>🚑 GoKematian - GoAmbulance</span>
          </a>
          <a href="/" class="header-badge">&larr; Kembali ke Beranda</a>
        </header>

        <div class="container">
          <div class="success-card">
            <div class="icon-badge">✓</div>
            <h2 class="card-title">Pemesanan Berhasil!</h2>
            <p class="card-subtitle">Terima kasih <strong>${pemesan}</strong>, pesanan ambulans darurat Anda telah kami terima.</p>

            <table class="summary-table">
              <tr>
                <td class="summary-label">Nama Pemesan</td>
                <td class="summary-value">${pemesan}</td>
              </tr>
              <tr>
                <td class="summary-label">No. Telepon / WA</td>
                <td class="summary-value">${nomorHP}</td>
              </tr>
              <tr>
                <td class="summary-label">Lokasi Penjemputan</td>
                <td class="summary-value">${lokasiJemput}</td>
              </tr>
              <tr>
                <td class="summary-label">Lokasi Tujuan</td>
                <td class="summary-value">${lokasiTujuan}</td>
              </tr>
              <tr>
                <td class="summary-label">Status Layanan</td>
                <td class="summary-value"><span class="status-badge">${statusPesanan}</span></td>
              </tr>
            </table>

            <p style="color: #777; font-size: 0.88rem; margin-bottom: 28px; line-height: 1.5;">
              Tim operasional ambulans kami akan segera menghubungi nomor Anda untuk konfirmasi penjemputan darurat.
            </p>

            <a href="/" class="btn-primary-go">&larr; Kembali ke Beranda</a>
          </div>
        </div>

        <!-- Footer -->
        <footer>
          <p>&copy; 2026 <strong>GoKematian Project</strong>. Layanan Pelayanan Publik Duka Cita Terpadu.</p>
        </footer>

      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error Ambulance Order:", error);
    if (req.headers["content-type"] === "application/json" || req.xhr) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.status(500).send("Gagal memproses pemesanan ambulans.");
  }
};
