const pool = require("../config/db");

// Créer la table si elle n'existe pas
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  age INT,
  poids FLOAT,
  taille FLOAT,
  sexe VARCHAR(10)
);

    `);
    console.log(" Table 'users' prête !");
  } catch (error) {
    console.error(" Erreur création table users :", error.message);
  }
};

createTable();

// Fonctions d'interaction avec la base de données
const User = {
  async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
  },

  async create(nom, email, password, age, poids, taille, sexe) {
    const { rows } = await pool.query(
     "INSERT INTO users (nom, email, password, age, poids, taille, sexe) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
[nom, email, password, age, poids, taille, sexe]

    );
    return rows[0];
  }, 
  async findAll() {
    const { rows } = await pool.query("SELECT id, nom, email FROM users");
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT id, nom, email FROM users WHERE id = $1", [id]);
    return rows[0];
  }
};

module.exports = User;
