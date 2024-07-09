const express = require("express");
const Categorie = require("../controller/categorie.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, Categorie.insert);
router.get("/", auth, Categorie.getAll);
router.get("/:id", auth, Categorie.getById);
router.put("/:id", auth, Categorie.updateById);
router.delete("/:id", auth, Categorie.deleteById);

module.exports = router;
