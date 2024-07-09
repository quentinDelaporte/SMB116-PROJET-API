const express = require("express");
const partie = require("../controller/partie.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/new", auth, partie.newParty);
router.post("/defi", auth, partie.newPartyDefi);
router.put("/score", auth, partie.updateScore);
router.get("/score/user/:userid", auth, partie.getScore);

module.exports = router;
