const User = require('../models/user');
const Room = require('../models/room');
const Parti = require('../models/participant');
const mongoose = require("mongoose");


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  try {
    const { userName, email, passwordHashh, passwordVerify } = req.body;

    if (!userName || !email || !passwordHashh || !passwordVerify)
      return res
        .status(400)
        .json('Please enter all require fields.' + userName + email + passwordHashh + passwordVerify);
    if (passwordHashh.length < 6)
      return res
        .status(400).json('Please enter at least 6 characters.');
    if (passwordHashh !== passwordVerify)
      return res
        .status(400)
        .json('Please enter the same password twice.');
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json('An account with this email exists.');

    //salt
    var salt;
    try {
      salt = await bcrypt.genSalt();
      // console.log(salt);
    }
    catch (error) {
      console.log(error);
    }
    // console.error("loi roi1");



    const passwordHash = await bcrypt.hash(passwordHashh, salt);
    // console.error("loi roi2");
    // console.log(userName+"/"+email+"/"+passwordHash);

    const newUser = new User({
      userName, email, passwordHash
    })
    // console.log(newUser);
    // console.error("loi roi3");

    //save user
    var savedUser;

    try {
      savedUser = await newUser.save();
    }
    catch (error) {
      console.log(error);
    }
    // console.error("loi roi4");


    const token = jwt.sign({
      user: savedUser._id
    },
      process.env.JWT_SECRET
    );
    // console.error("loi roi5");

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(201).json({
        Message: 'Sign up successfull!!!',
        user: savedUser.toObject({ getters: true })
      })
  } catch (error) {
    // console.error("loi roi");

    console.error(error);
    res.status(500).send();
  }
};

const login = async (req, res, next) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash)
      return res
        .status(400)
        .json("Please enter all required fields.");

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json("Wrong email or password.");



    const passwordCorrect = await bcrypt.compare(
      passwordHash,
      existingUser.passwordHash
    );

    if (!passwordCorrect)
      return res.status(401).json("Wrong email or password.");

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
      .status(202)
      .json({
        Message: "Sign in successfull.",
        user: existingUser.toObject({ getters: true }),
      });

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const logout = async (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
};

const loggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    res.send(true);
  } catch (err) {
    res.json(false);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { userID } = req.body;

    if (!userID)
      return res
        .status(400)
        .json('Please enter all require fields.');

    const existingUser = await User.find({ _id: userID });

    if (!existingUser)
      return res.status(400).json('No User exists.');


    return res.json(existingUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getUserInfoInParticipant = async (req, res, next) => {
  try {
    const { userID } = req.body;

    var findRoomIDPrivate = [];

    var findRoomNamePrivate = [];

    var findRoomID = [];

    var findUserID = [];

    if (!userID)
      return res
        .status(400)
        .json('Please enter all require fields.');


    // console.log("--Existing Participant--");

    const existingParti = await Parti.find({ userID });
    // console.log(existingParti);
    if (!existingParti) {
      return res.status(400).json('No participant exists.');
    }


    existingParti.forEach(element => {
      // console.log(element);
      // console.log(element.userID);
      findRoomID.push(element.roomID);
      // console.log(findRoomID);
    });

    // console.log("--Existing Private Room--");

    const existingPrivateRoom = await Room.find({_id:{$in: findRoomID}});

    existingPrivateRoom.forEach(element => {
      // console.log(element);
      // console.log(element.userID);
      if(element.type == "private"){
        findRoomIDPrivate.push(element._id);
        findRoomNamePrivate.push(element.name);
      }

      // console.log(findRoomID);
    });


    // console.log("--Exigting Room ID--");

    const existingRoomID = await Parti.find({roomID:{$in: findRoomIDPrivate}});
    // console.log(existingRoomID);
    if (!existingRoomID) {
      return res.status(400).json('No room exists.');
    }

    existingRoomID.forEach(element => {
      // console.log(element);
      // console.log(element.userID);
      if (element.userID != userID) {
        findUserID.push(element.userID);
        // console.log(findUserID);
      }
    });

    // console.log("--ExistingUser--");

    const existingUser = await User.find({ _id: {$in: findUserID }});

    if (!existingUser){
      return res.status(400).json('No User exists.');
    }

    existingUser.forEach(element => {
      existingRoomID.forEach(element1 => {
        if (element1.userID == element._id) {
          // console.log(element1);
          // Object.assign(element, {"roomID" : element1.roomID});
          element.passwordHash = element1.roomID;
          
        }
      });
      // console.log(element);
    });

    

    return res.json(existingUser);

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};



module.exports = { signup, login, loggedIn, logout, getUserInfo, getUserInfoInParticipant };