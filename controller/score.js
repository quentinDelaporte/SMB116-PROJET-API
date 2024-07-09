const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AppSMB116",
  password: "root",
  port: 5432,
});

exports.scoreByCategorie = async (req, res) => {
  await pool
    .query(
      "SELECT SUM(pa_score_global) as Score, COUNT(0) as partie_joue, ca_libelle FROM public.partie LEFT JOIN musique on fk_mu=mu_id LEFT JOIN categorie ON ca_id=fk_ca GROUP BY ca_libelle"
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

exports.scoreByArtiste = async (req, res) => {
  await pool
    .query(
      "SELECT SUM(pa_score_global) as Score, COUNT(0) as partie_joue, ar_nom FROM public.partie LEFT JOIN musique on fk_mu=mu_id LEFT JOIN artiste on fk_ar=ar_id GROUP BY ar_nom"
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
