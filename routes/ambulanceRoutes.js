const express = require("express");
const router = express.Router();
const path = require("path");
const ambulanceController = require("../controllers/ambulanceController");

// Route GET: Menampilkan halaman layanan ambulans
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/ambulance.html"));
});

// Route POST: Mengirim formulir pemesanan ambulans
router.post("/order", ambulanceController.createOrder);

module.exports = router;
