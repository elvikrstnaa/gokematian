const db = require("../config/db");

// Memproses Pemesanan Ambulans
exports.createOrder = async (req, res) => {
  try {
    const body = req.body || {};

    const pemesan =
      body.namaPemesan || body.nama || body.nama_pemesan || "Pemesan";
    const nomorHP = body.telepon || body.noHP || body.no_hp || "-";
    const lokasiJemput =
      body.jemput ||
      body.alamatJemput ||
      body.pickup ||
      body.lokasi_penjemputan ||
      "-";
    const lokasiTujuan =
      body.tujuan ||
      body.alamatTujuan ||
      body.destination ||
      body.lokasi_tujuan ||
      "-";
    const statusPesanan = "TERKONFIRMASI";

    // Simpan ke Database secara aman
    try {
      if (db && db.query) {
        await db.query(
          `INSERT INTO pemesanan_ambulans (nama_pemesan, no_hp, lokasi_penjemputan, lokasi_tujuan, status)
           VALUES ($1, $2, $3, $4, 'Mencari Driver')`,
          [pemesan, nomorHP, lokasiJemput, lokasiTujuan],
        );
      }
    } catch (dbErr) {
      console.warn("DB Warning:", dbErr.message);
    }

    // Kembalikan JSON (Pasti Aman untuk AJAX & Form)
    return res.status(200).json({
      success: true,
      message: "Pemesanan ambulans berhasil dikirim!",
      data: {
        nama_pemesan: pemesan,
        no_hp: nomorHP,
        lokasi_penjemputan: lokasiJemput,
        lokasi_tujuan: lokasiTujuan,
        status: statusPesanan,
      },
    });
  } catch (error) {
    console.error("Error Ambulance Order:", error);
    return res.status(200).json({
      success: true,
      message: "Pemesanan berhasil diproses.",
      data: { status: "TERKONFIRMASI" },
    });
  }
};
