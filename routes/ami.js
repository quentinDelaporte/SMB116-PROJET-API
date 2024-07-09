const express = require("express");
const ami = require("../controller/ami.js");
const auth = require("../controller/auth.js");
const router = express.Router();

router.post("/", auth, ami.insert);
router.put("/accepter", auth, ami.accepterAmi);
router.delete("/", auth, ami.delete);
router.get("/:ut_id", auth, ami.getAmiById);

module.exports = router;
