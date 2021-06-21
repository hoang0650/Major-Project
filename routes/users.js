const router = require('express').Router();
const {signup,login,loggedIn,logout,getUserInfo,getUserInfoInParticipant} = require('../controller/user-controller');

router.post('/signup',signup);
router.post('/login',login);
router.get('/loggedIn',loggedIn);
router.get('/logout',logout);
router.post('/userinfo',getUserInfo);
router.post('/userinfoinparti',getUserInfoInParticipant);


module.exports = router;