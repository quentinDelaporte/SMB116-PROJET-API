const express = require("express");
const musique = require("../controller/musique.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, musique.insert);
router.get("/:id", auth, musique.getById);
router.put("/:id", auth, musique.updateById);
router.delete("/:id", auth, musique.deleteById);

module.exports = router;
