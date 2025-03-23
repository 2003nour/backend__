const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { getMessages } = require("../controllers/authController"); // ← ajoute ça !

const router = express.Router();

// 🔓 Route publique pour les messages des utilisateurs
router.get("/messages", getMessages);

// 🔒 Récupérer le profil utilisateur (auth requise)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès",
      userId: req.user.userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// 🔓 Liste des utilisateurs (attention, ça expose tout)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
