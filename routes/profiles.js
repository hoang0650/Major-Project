const express = require('express');

const profilesController = require('../controller/profiles');

const storage = require('../helpers/storage');

const router = express.Router();

router.get('/', profilesController.getProfiles);

router.post('/', storage, profilesController.postProfile);

module.exports = router;
