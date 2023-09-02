const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/v1/createoraccessonetoonechat
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
//@route           GET /api/v1/fetchchats
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


//@description     Create New Group Chat
//@route           POST /api/v1/creategroupchat
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please Fill all the feilds"});
    }
    // convert string to array. cz from the fontend we are sending array of users.and we cannot send array from the fontend to the backend directly. so we have to convert it to string and then convert it back to array.
    let users = JSON.parse(req.body.users);
    // group chat must have more than 2 users
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
                                                chatName   : req.body.name,
                                                users      : users,
                                                isGroupChat: true,
                                                groupAdmin : req.user,
                                            });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
                                        .populate("users", "-password")
                                        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = {accessChat, fetchChats, createGroupChat};