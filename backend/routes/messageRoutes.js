const express = require("express");
const {
          allMessages,
          sendMessage,
      } = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/allmessage/:chatId").get(protect, allMessages);
router.route("/sendmessage").post(protect, sendMessage);

module.exports = router;
