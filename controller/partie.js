const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.newParty = async (req, res) => {
  const { ut_id, ca_id } = req.body;

  await pool
    .query(
      "WITH random_musique AS (SELECT * FROM Musique LEFT JOIN Artiste ON ar_id = fk_ar LEFT JOIN Categorie ON ca_id = fk_ca WHERE Categorie.ca_id = $1 ORDER BY RANDOM() LIMIT 4 ), marked_musique AS ( SELECT  CASE WHEN ROW_NUMBER() OVER () = 1 THEN true ELSE false END AS est_bonne_reponse, * FROM random_musique ) SELECT * FROM marked_musique",
      [ca_id]
    )
    .then(async function (result, err) {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      let ress = result.rows;
      await pool
        .query(
          "INSERT INTO Partie (pa_score_global, pa_date,fk_ut, fk_mu) VALUES (0,CURRENT_DATE, $1, $2) RETURNING *",
          [ut_id, result.rows[0]["mu_id"]]
        )
        .then(async function (result, err) {
          if (err) {
            res.status(500).json({
              error: err.message,
            });
          }
          console.log(result.rows);
          res.status(200).json({
            musiques: ress,
            ...result.rows[0],
          });
        });
    });
};

exports.newPartyDefi = async (req, res) => {
  const { ut_id, ut_id_2, ca_id } = req.body;

  await pool
    .query(
      "WITH random_musique AS (SELECT * FROM Musique LEFT JOIN Artiste ON ar_id = fk_ar LEFT JOIN Categorie ON ca_id = fk_ca WHERE Categorie.ca_id = $1 ORDER BY RANDOM() LIMIT 4 ), marked_musique AS ( SELECT  CASE WHEN ROW_NUMBER() OVER () = 1 THEN true ELSE false END AS est_bonne_reponse, * FROM random_musique ) SELECT * FROM marked_musique",
      [ca_id]
    )
    .then(async function (result, err) {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      let ress = result.rows;
      await pool
        .query(
          "INSERT INTO Partie (pa_score_global, pa_date, fk_ut, fk_mu, fk_ut_2) VALUES (0,CURRENT_DATE, $1, $2, $3) RETURNING *",
          [ut_id, result.rows[0]["mu_id"], ut_id_2]
        )
        .then(async function (result, err) {
          if (err) {
            res.status(500).json({
              error: err.message,
            });
          }
          console.log(result.rows);
          res.status(200).json({
            musiques: ress,
            ...result.rows[0],
          });
        });
    });
};

exports.updateScore = async (req, res) => {
  const { pa_id, score } = req.body;

  await pool
    .query(
      "UPDATE Partie SET pa_score_global = pa_score_global+$1 WHERE pa_id=$2 RETURNING *",
      [score, pa_id]
    )
    .then(async function (result, err) {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).json(result.rows[0]);
    });
};

exports.getScore = async (req, res) => {
  const { userid } = req.params;
  const { limit } = req.query;

  await pool
    .query(
      "SELECT * FROM Partie WHERE fk_ut = $1 ORDER BY pa_date DESC LIMIT $2",
      [userid, limit]
    )
    .then(async function (result, err) {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).json(result.rows);
    });
};
