const pool = require("../config/db");

// ✅ Créer un sujet de discussion
exports.createTopic = async (req, res) => {
  try {
    const { titre, contenu, userId } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO forum (titre, contenu, user_id) VALUES ($1, $2, $3) RETURNING *",
      [titre, contenu, userId]
    );
    res.status(201).json({ message: "Sujet créé avec succès !", topic: rows[0] });
  } catch (error) {
    console.error("❌ Erreur lors de la création du sujet :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Récupérer tous les sujets
exports.getAllTopics = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM forum ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des sujets :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Récupérer un sujet avec ses messages
exports.getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le sujet
    const topic = await pool.query("SELECT * FROM forum WHERE id = $1", [id]);

    // Récupérer les messages du sujet
    const messages = await pool.query(
      "SELECT * FROM messages WHERE forum_id = $1 ORDER BY created_at ASC",
      [id]
    );

    if (topic.rows.length === 0) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    res.status(200).json({ topic: topic.rows[0], messages: messages.rows });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du sujet :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Ajouter un message à un sujet
exports.addMessage = async (req, res) => {
  try {
    const { forumId, userId, contenu } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO messages (forum_id, user_id, contenu) VALUES ($1, $2, $3) RETURNING *",
      [forumId, userId, contenu]
    );
    res.status(201).json({ message: "Message ajouté avec succès !", newMessage: rows[0] });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
