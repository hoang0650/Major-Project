const router = require('express').Router();
const {signup,login,loggedIn,logout} = require('../controller/user-controller');

router.post('/signup',signup);
router.post('/login',login);
router.get('/loggedIn',loggedIn);
router.get('/logout',logout);
module.exports = router;