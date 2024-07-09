const express = require("express");
const message = require("../controller/message");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, message.insert);
router.get("/:id", auth, message.getById);
router.put("/:id", auth, message.updateById);
router.delete("/:id", auth, message.deleteById);
router.get("/user/:ut_id", auth, message.getMessagesByUserId);
router.get(
  "/user/:ut_id_receveur/:ut_id_emeteur",
  auth,
  message.getMessagesByEmetteurAndReceveur
);
router.put("/discutions", auth, message.getDiscutions);

module.exports = router;
