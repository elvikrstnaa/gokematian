const express = require("express");
const router = express.Router();
const path = require("path");
const administrasiController = require("../controllers/administrasiController");

// 1. [User/Keluarga] Route GET: Menampilkan halaman formulir administrasi
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/administrasi.html"));
});

// 2. [User/Keluarga] Route POST: Mengirim formulir pengajuan (Submit Form)
router.post("/order", administrasiController.createAdministrasiOrder);

// 3. [User & Admin] Route GET: Memantau status permohonan secara real-time
router.get("/status/:id", administrasiController.getSubmissionStatus);

// 4. [Admin/Disdukcapil] Route POST: Verifikasi berkas (Setujui / Tolak)
router.post("/verify/:id", administrasiController.verifySubmission);

module.exports = router;
