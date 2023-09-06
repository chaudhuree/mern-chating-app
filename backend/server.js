const { readdirSync } = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const colors = require("colors");
const connectDB = require("./config/db");
const {errorHandler, notFound} = require("./middleware/errorMiddleware");


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

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, () => {
  console.log("Server running on port 5000");
});


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        // credentials: true,
    },
});

// socket functions
io.on("connection", (socket) => {
    console.log("connected to socket".rainbow);
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
        // socket.to(chat._id).emit("message recieved", newMessageRecieved);
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
