const { readdirSync } = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const {errorHandler, notFound} = require("./middleware/errorMiddleware");


dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
    // create a room for each user with their own mongo id and join them to it
    // after joining they also emit a connected event to the frontend
    // with this the frontend knows that the user is connected to the socket
    // there it setSocketConnected to true
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    // join chat room with the chat id
    //  means created chat with other user and it's id
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    // for showing typing message indicator
    // room mean chat id here
    // so when someone in the group or chat is typing it emits typing event from frontend
    // and here we listen to it and broadcast it to the room so that everyone in the room can see it
    // same for stop typing
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    // when someone sends a message it emits new message event from frontend and also sends the full message object. it is created using the message model
    // here we listen to it and broadcast it to the room so that everyone in the room can see it except the sender.
    // it is done in the sendMessage function in the chat screen.
    // that means first create the message and send it to the backend and then emit the new message event from frontend with the response from the backend data.
    // then from the backend we broadcast it to the room so that everyone in the room can see it except the sender immediately. that means real time.
    // then from backend an event is emitted with the name message received.
    // it sends back the full message object to the frontend.
    // in the fontend we listen to and check if the other user is in the same chat or not using the selectedchatcompare.
    // if the user is not in the chat then the message is pushed in the notifications array. and if user click on the notification then the selectedchat is set to the chat so the corresponding chat is opened. also removed the notification from the array by filtering it out.
    // but if the user is in the  same chat then the message is pushed in the messages array in the last position.so the message is shown in the chat screen.
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            // no need to send the message to the sender
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
