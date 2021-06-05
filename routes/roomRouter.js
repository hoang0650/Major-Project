const router = require('express').Router();
const {getRoom,createRoom,updateRoom,deleteRoom} = require('../controller/room-controller');

router.post('/',getRoom);
router.post('/create-room',createRoom);
router.get('/delete-room/:id',deleteRoom);
router.post('/update-room',updateRoom);

module.exports = router;
