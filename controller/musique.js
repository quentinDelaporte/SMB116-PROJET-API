const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  const { mu_titre, mu_date_sortie, mu_nom_fichier } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Musique (mu_titre, mu_date_sortie, mu_nom_fichier) VALUES ($1, $2, $3) RETURNING *",
      [mu_titre, mu_date_sortie, mu_nom_fichier]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Musique WHERE mu_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Musique not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { mu_titre, mu_date_sortie } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Musique SET mu_titre = $1, mu_date_sortie = $2 WHERE mu_id = $3 RETURNING *",
      [mu_titre, mu_date_sortie, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Musique not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Musique WHERE mu_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Musique not found" });
    }
    res.status(200).json({ message: "Musique deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
