const router = require('express').Router();
const {getMsg,sendMsg,deleteMsg,updateMsg} = require('../controller/chat-controller');

router.get('/',getMsg);
router.post('/send',sendMsg);
router.get('/delete/:id',deleteMsg);
router.get('/update/:id',updateMsg);
module.exports = router;