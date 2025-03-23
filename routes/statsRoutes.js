const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getUserStats } = require("../controllers/statsController");

const router = express.Router();

router.get("/user", authMiddleware, getUserStats); // ✅ Obtenir les stats d'un utilisateur

module.exports = router;
