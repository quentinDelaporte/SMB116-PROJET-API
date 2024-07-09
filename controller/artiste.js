const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  const { ar_nom } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Artiste (ar_nom) VALUES ($1) RETURNING *",
      [ar_nom]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Artiste WHERE ar_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artiste not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { ar_nom } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Artiste SET ar_nom = $1 WHERE ar_id = $2 RETURNING *",
      [ar_nom, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artiste not found" });
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
      "DELETE FROM Artiste WHERE ar_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artiste not found" });
    }
    res.status(200).json({ message: "Artiste deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
