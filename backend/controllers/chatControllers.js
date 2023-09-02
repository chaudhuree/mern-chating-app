const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    const isChat = await Chat.find({
                                       isGroupChat: false,
                                       users      : {$all: [req.user._id, userId]},
                                   })
                             .populate({
                                           path  : "users",
                                           select: "-password",
                                       })
                             .populate({
                                           path    : "latestMessage",
                                           populate: {
                                               path  : "sender",
                                               select: "name pic email",
                                           },
                                       });


    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName   : "sender",
            isGroupChat: false,
            users      : [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
                                  .populate("users", "-password")
                                  .populate("groupAdmin", "-password")
                                  .populate({
                                                path    : "latestMessage",
                                                populate: {
                                                    path  : "sender",
                                                    select: "name pic email",
                                                },
                                            })
                                  .sort({updatedAt: -1});

        res.status(200).send(results);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = {accessChat, fetchChats};