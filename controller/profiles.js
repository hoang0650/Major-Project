const Profile = require('../models/profile');

exports.getProfiles = async (req, res) => {
  const profiles = await Profile.find();
  res.status(200).json({ profiles });
};
exports.getProfile = async (req, res) => {
  let userID = req.params.uid;
  console.log(userID);
  const profile = await Profile.findOne({
    userID: userID
  });
  res.status(200).json({profile});
}
exports.postProfile = async (req, res) => {
  const { name, userID } = req.body;
  //console.log(userID);
  const imagePath = 'http://localhost:3000/images/' + req.file.filename; // Note: set path dynamically
  const profile = new Profile({
    userID,
    name,
    imagePath,
  });
  const createdProfile = await profile.save();
  res.status(201).json({
    profile: {
      ...createdProfile._doc,
    },
  });
};
