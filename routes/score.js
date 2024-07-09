const express = require("express");
const score = require("../controller/score.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.get("/categorie", auth, score.scoreByCategorie);
router.get("/artiste", auth, score.scoreByArtiste);

module.exports = router;
