const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  const { ca_libelle } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Categorie (ca_libelle) VALUES ($1) RETURNING *",
      [ca_libelle]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Categorie");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Categorie WHERE ca_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categorie not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { ca_libelle } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Categorie SET ca_libelle = $1 WHERE ca_id = $2 RETURNING *",
      [ca_libelle, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categorie not found" });
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
      "DELETE FROM Categorie WHERE ca_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categorie not found" });
    }
    res.status(200).json({ message: "Categorie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
