const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  const { ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Utilisateur (ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("SELECT * FROM Utilisateur WHERE ut_id = " + id);
    const result = await pool.query(
      "SELECT * FROM Utilisateur WHERE ut_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur not found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUtilisateurName = async (req, res) => {
  const { ut_nom_utilisateur } = req.params;
  try {
    console.log(
      "SELECT * FROM Utilisateur WHERE ut_nom_utilisateur = " +
        ut_nom_utilisateur
    );
    const result = await pool.query(
      "SELECT * FROM Utilisateur WHERE ut_nom_utilisateur = $1",

      [ut_nom_utilisateur]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur not found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE Utilisateur SET ut_nom = $1, ut_prenom = $2, ut_nom_utilisateur = $3, ut_email = $4, ut_mot_passe = $5 WHERE ut_id = $6 RETURNING *",
      [ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur not found" });
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
      "DELETE FROM Utilisateur WHERE ut_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur not found" });
    }
    res.status(200).json({ message: "Utilisateur deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  pool.query(
    "SELECT * FROM Utilisateur WHERE ut_email = $1 AND ut_mot_passe = $2",
    [req.body.ut_email, req.body.ut_mot_passe],
    (err, resSQL) => {
      if (err) {
        console.error({ source: "", erreur: err.message });
        res.status(400).send({
          success: false,
          error: err.message,
        });
      } else {
        if (resSQL.rows.length === 0) {
          res.status(200).send(false);
        } else {
          res.status(200).send(resSQL.rows);
        }
      }
    }
  );
};

exports.register = async (req, res) => {
  pool.query(
    "INSERT INTO Utilisateur (ut_nom, ut_prenom, ut_nom_utilisateur, ut_email, ut_mot_passe) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      req.body.ut_nom,
      req.body.ut_prenom,
      req.body.ut_nom_utilisateur,
      req.body.ut_email,
      req.body.ut_mot_passe,
    ],
    (err, resSQL) => {
      if (err) {
        console.error({ source: "", erreur: err.message });
        res.status(400).send({
          success: false,
          error: err.message,
        });
      } else {
        res.status(200).send(resSQL.rows);
      }
    }
  );
};
