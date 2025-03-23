const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const pool = require("./config/db");

// Import des routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const trainingRoutes = require("./routes/trainingRoutes"); // ✅ Vérifie cet import
const statsRoutes = require("./routes/statsRoutes");
const forumRoutes = require("./routes/forumRoutes");
const challengeRoutes = require("./routes/challengeRoutes");

const app = express();

// Vérification de la connexion à PostgreSQL
pool.connect()
  .then(() => console.log("✅ PostgreSQL connecté !"))
  .catch(err => console.error("❌ Erreur PostgreSQL :", err.message));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/training", trainingRoutes); // ✅ Vérifie que cette ligne est bien là
app.use("/api/stats", statsRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/challenge", challengeRoutes);

// Gérer les routes inconnues
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route non trouvée !" });
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
