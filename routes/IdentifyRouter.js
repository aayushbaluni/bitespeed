const handleIdentifyController = require("../controllers/identifyController");

const express = require('express');

const router = express.Router();

router.route('/').post(handleIdentifyController);


module.exports = router;