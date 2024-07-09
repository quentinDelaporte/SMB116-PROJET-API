const express = require("express");
const Artiste = require("../controller/artiste.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, Artiste.insert);
router.get("/:id", auth, Artiste.getById);
router.put("/:id", auth, Artiste.updateById);
router.delete("/:id", auth, Artiste.deleteById);

module.exports = router;
