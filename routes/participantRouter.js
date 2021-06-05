const router = require('express').Router();
const {getParticipant,createParticipant,updateParticipant,deleteParticipant} = require('../controller/participant-controller');

router.post('/',getParticipant);
router.post('/create-parti',createParticipant);
router.get('/delete-parti/:id',updateParticipant);
router.post('/update-parti',deleteParticipant);

module.exports = router;
