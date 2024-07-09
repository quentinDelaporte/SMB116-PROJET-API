const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.insert = async (req, res) => {
  console.log("insert");
  const { ut_id, ut_id_1 } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Ami (ut_id, ut_id_1, am_est_accepte) VALUES ($1, $2, false) RETURNING *",
      [ut_id, ut_id_1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.accepterAmi = async (req, res) => {
  console.log("accepterAmi");
  const { ut_id, ut_id_1 } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Ami SET am_est_accepte = true WHERE ut_id = $1 AND ut_id_1 = $2 RETURNING *",
      [ut_id, ut_id_1]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { ut_id, ut_id_1 } = req.body;
  try {
    const result = await pool.query(
      "DELETE FROM Ami WHERE (ut_id = $1 AND ut_id_1 = $2) OR (ut_id = $3 AND ut_id_1 = $4) RETURNING *",
      [ut_id, ut_id_1, ut_id_1, ut_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAmiById = async (req, res) => {
  console.log("getAmiById");
  const { ut_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT  CASE  WHEN a.ut_id = $1 THEN u2.ut_id ELSE u1.ut_id END AS id, CASE  WHEN a.ut_id = $2 THEN u2.ut_nom_utilisateur ELSE u1.ut_nom_utilisateur END AS name FROM  Ami a JOIN  utilisateur u1 ON a.ut_id = u1.ut_id JOIN  utilisateur u2 ON a.ut_id_1 = u2.ut_id WHERE  (a.ut_id = $3 OR a.ut_id_1 = $4) AND (u1.ut_id <> $5 OR u2.ut_id <> $6);",
      [ut_id, ut_id, ut_id, ut_id, ut_id, ut_id]
    );
    console.log(
      "SELECT CASE WHEN (a.ut_id = " +
        ut_id +
        ") THEN u2.ut_id ELSE u1.ut_id END AS id, CASE WHEN (a.ut_id = " +
        ut_id +
        ") THEN u2.ut_nom_utilisateur ELSE u1.ut_nom_utilisateur END AS name FROM Ami a JOIN utilisateur u1 ON a.ut_id = u1.ut_id JOIN utilisateur u2 ON a.ut_id_1 = u2.ut_id WHERE (a.ut_id = " +
        ut_id +
        " OR a.ut_id_1 = " +
        ut_id +
        ") AND (u1.ut_id <> " +
        ut_id +
        " OR u2.ut_id <> " +
        ut_id +
        ");",
      result.rows
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
