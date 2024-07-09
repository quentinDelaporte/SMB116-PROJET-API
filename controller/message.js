const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  const { ut_id_emeteur, ut_id_receveur, mes_message } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO Message (ut_id_emeteur, ut_id_receveur, mes_message) VALUES ($1, $2, $3) RETURNING *",
      [ut_id_emeteur, ut_id_receveur, mes_message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Message WHERE mes_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { ut_id_emeteur, ut_id_receveur, mes_message } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Message SET ut_id_emeteur = $1, ut_id_receveur = $2, mes_message = $3 WHERE mes_id = $4 RETURNING *",
      [ut_id_emeteur, ut_id_receveur, mes_message, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
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
      "DELETE FROM Message WHERE mes_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessagesByUserId = async (req, res) => {
  const { ut_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Message WHERE ut_id_emeteur = $1 OR ut_id_receveur = $2",
      [ut_id, ut_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscutions = async (req, res) => {
  const { ut_id } = req.body;
  try {
    const result = await pool.query(
      "SELECT  CASE  WHEN ut_id_emeteur = $1 THEN u2.ut_id  ELSE u1.ut_id  END AS ut_nom_utilisateur, CASE  WHEN ut_id_emeteur = $2 THEN u2.ut_id  ELSE u1.ut_id  END AS ut_id FROM Message  LEFT JOIN Utilisateur  as u2 ON u2.ut_id = ut_id_emeteur LEFT JOIN Utilisateur as u1 ON u1.ut_id = ut_id_receveur WHERE ( u1.ut_id = $3 OR u2.ut_id = $4) AND (ut_id_receveur <> $5 OR ut_id_emeteur <> $6);",
      [ut_id, ut_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessagesByEmetteurAndReceveur = async (req, res) => {
  const { ut_id_receveur, ut_id_emeteur } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Message WHERE (ut_id_emeteur = $1 OR ut_id_receveur = $2) AND (ut_id_emeteur = $3 OR ut_id_receveur = $4)",
      [ut_id_receveur, ut_id_receveur, ut_id_emeteur, ut_id_emeteur]
    );
    console.log(
      "SELECT * FROM Message WHERE (ut_id_emeteur = " +
        ut_id_receveur +
        " OR ut_id_receveur = " +
        ut_id_receveur +
        ") AND ut_id_emeteur = " +
        ut_id_emeteur +
        " OR ut_id_receveur = " +
        ut_id_emeteur,
      result.rows
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
