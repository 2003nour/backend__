const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const pool = require("../config/db");
exports.register = async (req, res) => {
  try {
    const { nom, email, password, age, poids, taille, sexe } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "❌ Cet email est déjà utilisé. Essayez un autre !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(nom, email, hashedPassword, age, poids, taille, sexe);

    res.status(201).json({ message: "✅ Inscription réussie !", user: newUser });
  } catch (error) {
    console.error("❌ Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { message } = req.body;

    await pool.query("UPDATE users SET message = $1 WHERE id = $2", [message, userId]);

    console.log(`✅ Message de l'utilisateur ${userId} mis à jour :`, message);

    res.status(200).json({ message: "Message enregistré avec succès." });
  } catch (error) {
    console.error("❌ Erreur updateMessage :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.getMessages = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT nom, message FROM users WHERE message IS NOT NULL AND message <> ''");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Erreur getMessages :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateMessage = async (req, res) => {
  const { userId } = req.user;
  const { message } = req.body;

  if (!message) return res.status(400).json({ message: "Message requis" });

  try {
    const { rowCount } = await pool.query(
      "UPDATE users SET message = $1 WHERE id = $2",
      [message, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log(`✅ Message enregistré par l'utilisateur ${userId} :`, message);
    res.status(200).json({ message: "Message mis à jour avec succès" });
  } catch (err) {
    console.error("❌ Erreur updateMessage:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.updateUserProfile = async (req, res) => {
  console.log("📥 Requête reçue pour mise à jour :", req.body); // 👈 ajoute ça

  try {
    const { userId } = req.user;
    const { age, taille, sexe } = req.body;

    if (!age || !taille || !sexe) {
      return res.status(400).json({ message: "❌ Tous les champs sont requis." });
    }

    const { rowCount } = await pool.query(
      "UPDATE users SET age = $1, taille = $2, sexe = $3 WHERE id = $4",
      [age, taille, sexe, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "❌ Utilisateur non trouvé." });
    }

    console.log(`✅ Mise à jour utilisateur ${userId} réussie :`, { age, taille, sexe });
    res.status(200).json({ message: "✅ Profil mis à jour avec succès." });

  } catch (error) {
    console.error("❌ Erreur mise à jour profil :", error); // 👈 ici on verra l’erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "❌ Identifiants incorrects." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Identifiants incorrects." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "✅ Connexion réussie !", token });
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
