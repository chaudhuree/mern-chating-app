const express = require("express");
const {
          accessChat

      } = require("../controllers/chatControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createoraccessonetoonechat",protect, accessChat);

module.exports = router;