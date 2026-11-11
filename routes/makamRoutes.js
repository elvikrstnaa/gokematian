const express = require("express");
const router = express.Router();
const path = require("path");
const makamController = require("../controllers/makamController");

// Route GET: Mengambil daftar lahan TPU yang tersedia
router.get("/", makamController.getMakamPage);

// Route GET: Menampilkan halaman formulir pemesanan TPU
router.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/form-makam.html"));
});

// Route POST: Melakukan pemesanan/booking lahan TPU
router.post("/order", makamController.createMakamOrder);

// Export router di baris paling bawah
module.exports = router;
