const pool = require("../config/db");

const Stats = {
  async getStats(userId) {
    const { rows } = await pool.query(
      "SELECT SUM(duration) AS total_duration, SUM(calories) AS total_calories FROM trainings WHERE user_id = $1",
      [userId]
    );
    return rows[0];
  }
};

module.exports = Stats;
