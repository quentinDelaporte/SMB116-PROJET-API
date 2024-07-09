const express = require("express");
const utilisateur = require("../controller/utilisateur.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, utilisateur.insert);
router.get("/:id", auth, utilisateur.getById);
router.get(
  "/username/:ut_nom_utilisateur",
  auth,
  utilisateur.getByUtilisateurName
);
router.put("/:id", auth, utilisateur.updateById);
router.delete("/:id", auth, utilisateur.deleteById);
router.post("/login", auth, utilisateur.login);
router.post("/register", auth, utilisateur.register);

module.exports = router;
