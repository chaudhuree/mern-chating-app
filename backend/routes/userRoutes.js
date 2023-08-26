const express = require("express");
const {
          registerUser,
          authUser,
          allUsers,
      } = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/users",protect,allUsers);
router.post("/register",registerUser);
router.post("/login", authUser);

module.exports = router;
