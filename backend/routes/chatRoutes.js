const express = require("express");
const {
          accessChat,
          fetchChats,
          createGroupChat,

      } = require("../controllers/chatControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createoraccessonetoonechat", protect, accessChat);
router.get("/fetchchats", protect, fetchChats);
router.post("/creategroupchat", protect, createGroupChat);


module.exports = router;