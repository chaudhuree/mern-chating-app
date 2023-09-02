const express = require("express");
const {
          accessChat,
          fetchChats,
          createGroupChat,
          renameGroup,
    addToGroup

      } = require("../controllers/chatControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createoraccessonetoonechat", protect, accessChat);
router.get("/fetchchats", protect, fetchChats);
router.post("/creategroupchat", protect, createGroupChat);
router.put("/renamegroup", protect, renameGroup);
router.put("/addtogroup", protect, addToGroup);


module.exports = router;