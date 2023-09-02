const express = require("express");
const {
          accessChat,
          fetchChats,

      } = require("../controllers/chatControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createoraccessonetoonechat",protect, accessChat);
router.get("/fetchchats",protect, fetchChats);


module.exports = router;