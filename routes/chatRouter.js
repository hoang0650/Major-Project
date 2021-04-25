const router = require('express').Router();
const Chat = require('../models/chat');
const auth = require('../middleware/auth');

router.post('/',async(req,res)=>{
	try {
		const {sender,message}= req.body;

		const  newChat= new Chat({
			sender,message
		});

		const savedChat = await newChat.save();

		res.json(savedChat);
	} catch (error) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = router;