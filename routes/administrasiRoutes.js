const express = require("express");
const router = express.Router();
const path = require("path");
const administrasiController = require("../controllers/administrasiController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/administrasi.html"));
});

router.post("/order", administrasiController.createAdministrasiOrder);

module.exports = router;
