const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/v1/allmessage/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
                                      .populate("sender", "name pic email")
                                      .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// to create a message we need, chat id, sender id, content
// sender id is the logged-in user,
// so we can have this from the req.user(middleware)

//@description     Create New Message
//@route           POST /api/v1/sendmessage
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);
        // as we are not using like message.findOne(_id: message._id), so we need to use execPopulate()

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await message.populate("chat.users", "name pic email");
        // message = await User.populate(message, {
        //     path: "chat.users",
        //     select: "name pic email",
        // });

        // below code is to update the latest message in chat model
        // whenever a new message is sent in a chat, the latest message in chat model will be updated with the new message
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message._id });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { allMessages, sendMessage };
