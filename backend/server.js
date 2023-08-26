const { readdirSync } = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");


dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({crossOriginResourcePolicy: false}))

// db connection
connectDB();

// routes
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`)))
app.get("/", (req, res) => {
    res.send("server is on");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port 5000");
});