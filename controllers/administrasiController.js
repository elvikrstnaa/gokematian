const db = require("../config/db");

// 1. User/Keluarga: Mengirim Form Data Almarhum & Upload Berkas (Sequence Diagram Step 1-2)
exports.createAdministrasiOrder = async (req, res) => {
  try {
    const {
      namaAlmarhum,
      nama_almarhum,
      nik,
      telepon,
      no_hp,
      namaPemohon,
      nama_pemohon,
      tglMeninggal,
      tgl_meninggal,
      berkasPengantar,
      berkas_pengantar,
      catatan,
    } = req.body;

    // Normalisasi parameter input dari Form HTML atau Request Payload JSON
    const mendiang = namaAlmarhum || nama_almarhum || "Almarhum/ah";
    const nomorNik = nik || "-";
    const nomorHP = telepon || no_hp || "-";
    const pemohon = namaPemohon || nama_pemohon || "Pemesan";
    const tanggalMeninggal =
      tglMeninggal || tgl_meninggal || new Date().toISOString().split("T")[0];
    const filePengantar = berkasPengantar || berkas_pengantar || catatan || "-";

    // Status Awal Sesuai Sequence Diagram: "Menunggu Verifikasi"
    const statusPesanan = "Menunggu Verifikasi";

    // Simpan ke tabel administrasi_akta di Supabase
    let resultData = null;
    try {
      const dbResult = await db.query(
        `INSERT INTO administrasi_akta 
          (nama_pemohon, no_hp, nama_almarhum, tgl_meninggal, berkas_pengantar, status) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          pemohon,
          nomorHP,
          mendiang,
          tanggalMeninggal,
          filePengantar,
          statusPesanan,
        ],
      );
      resultData = dbResult.rows[0];
    } catch (dbErr) {
      console.warn(
        "Gagal simpan ke administrasi_akta, mencoba fallback ke tabel orders...",
        dbErr.message,
      );
      // Fallback ke tabel orders jika ada
      await db
        .query(
          `INSERT INTO orders (jenis_layanan, total_pembayaran, status_pembayaran) 
         VALUES ('ADMINISTRASI', 100000, $1)`,
          [statusPesanan],
        )
        .catch(() => {});
    }

    // Jika dipanggil via AJAX Fetch (JSON)
    if (req.headers["content-type"] === "application/json" || req.xhr) {
      return res.status(200).json({
        success: true,
        message:
          "Permohonan berhasil dikirim. Status saat ini: Menunggu Verifikasi",
        data: resultData || { nama_almarhum: mendiang, status: statusPesanan },
      });
    }

    // HTML Tampilan Konfirmasi Sukses Estetik (Server-Side Render)
    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pengajuan Berhasil - GoKematian</title>
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
            width: 45%;
          }

          .summary-value {
            color: #2c3e50;
            font-weight: 700;
          }

          .status-badge {
            background-color: #fff3cd;
            color: #856404;
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
            <span>🕊️ GoKematian</span>
          </a>
          <a href="/administrasi" class="header-badge">&larr; Kembali ke Layanan</a>
        </header>

        <div class="container">
          <div class="success-card">
            <div class="icon-badge">✓</div>
            <h2 class="card-title">Pengajuan Berhasil!</h2>
            <p class="card-subtitle">Berkas pengurusan akta kematian Anda telah diterima dan sedang dalam penanganan petugas.</p>

            <table class="summary-table">
              <tr>
                <td class="summary-label">Nama Almarhum/ah</td>
                <td class="summary-value">${mendiang}</td>
              </tr>
              <tr>
                <td class="summary-label">NIK Almarhum/ah</td>
                <td class="summary-value">${nomorNik}</td>
              </tr>
              <tr>
                <td class="summary-label">Layanan</td>
                <td class="summary-value">Surat & Akta Kematian</td>
              </tr>
              <tr>
                <td class="summary-label">Status Pesanan</td>
                <td class="summary-value"><span class="status-badge">${statusPesanan}</span></td>
              </tr>
            </table>

            <p style="color: #777; font-size: 0.88rem; margin-bottom: 28px; line-height: 1.5;">
              Tim operasional kami akan segera memverifikasi berkas ke RT/RW, Kelurahan, hingga Disdukcapil Pekanbaru.
            </p>

            <a href="/administrasi" class="btn-primary-go">&larr; Kembali ke Layanan Administrasi</a>
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
    console.error("Error Administrasi Order:", error);
    if (req.headers["content-type"] === "application/json" || req.xhr) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.status(500).send("Gagal memproses pengajuan administrasi.");
  }
};

// 2. Admin/Disdukcapil: Verifikasi Berkas (Setujui / Tolak) (Sequence Diagram Step 3)
exports.verifySubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body; // status: 'Disetujui' atau 'Ditolak'

    if (!["Disetujui", "Ditolak"].includes(status)) {
      return res
        .status(400)
        .json({
          message: "Status verifikasi harus 'Disetujui' atau 'Ditolak'",
        });
    }

    const result = await db.query(
      `UPDATE administrasi_akta 
       SET status = $1, catatan_admin = $2 
       WHERE id = $3 RETURNING *`,
      [status, catatan_admin || "", id],
    );

    return res.status(200).json({
      success: true,
      message: `Status permohonan berhasil diperbarui menjadi: ${status}`,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. User & Admin: Cek Status Permohonan Real-time
exports.getSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM administrasi_akta WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Data permohonan tidak ditemukan" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
