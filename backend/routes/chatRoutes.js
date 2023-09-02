const express = require("express");
const {
          accessChat,
          fetchChats,
          createGroupChat,
          renameGroup,
    addToGroup,
    removeFromGroup

      } = require("../controllers/chatControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createoraccessonetoonechat", protect, accessChat);
router.get("/fetchchats", protect, fetchChats);
router.post("/creategroupchat", protect, createGroupChat);
router.put("/renamegroup", protect, renameGroup);
router.put("/addtogroup", protect, addToGroup);
router.put("/removefromgroup", protect, removeFromGroup);


module.exports = router;