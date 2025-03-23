const pool = require("../config/db");

// ✅ Récupérer les statistiques d'un utilisateur
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM stats WHERE user_id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune statistique trouvée pour cet utilisateur." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Mettre à jour les statistiques après un entraînement
exports.updateStats = async (req, res) => {
  try {
    const { userId, calories_burned, total_time, workouts_completed } = req.body;

    const { rows } = await pool.query(
      `UPDATE stats 
       SET calories_burned = calories_burned + $2, 
           total_time = total_time + $3, 
           workouts_completed = workouts_completed + $4
       WHERE user_id = $1 RETURNING *`,
      [userId, calories_burned, total_time, workouts_completed]
    );

    res.status(200).json({ message: "Statistiques mises à jour !", stats: rows[0] });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des statistiques :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
