const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");

//@description     Get or Search all users
//@route           GET /api/v1/users?search=sohan
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req?.query.search
                    ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
                    : {};

    const users = await User.find(keyword).find({ _id: { $ne: req?.user._id } });
    res?.send(users);
});

//@description     Register new user
//@route           POST /api/v1/register
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req?.body;

    if (!name || !email || !password) {
        res?.status(400).json({ message: "Please Enter all the Feilds" });
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        throw new Error("User already exists");
    }

    const user = await User.create({
                                       name,
                                       email,
                                       password,
                                       pic,
                                   });

    if (user) {
        res.status(201).json({
                                 _id: user._id,
                                 name: user.name,
                                 email: user.email,
                                 isAdmin: user.isAdmin,
                                 pic: user.pic,
                                 token: generateToken(user._id),
                             });
    } else {
        res.status(400).json({ message: "Problem in creating user for now. contact the developer: chaudhuree@gmail.com" });
        throw new Error("Problem in creating user.");
    }
});

//@description     Auth the user
//@route           POST /api/v1/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     isAdmin: user.isAdmin,
                     pic: user.pic,
                     token: generateToken(user._id),
                 });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

module.exports = { allUsers, registerUser, authUser };
