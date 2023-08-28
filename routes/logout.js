const express = require('express');
const router = express.Router();
const {handleUserLogOut}= require('../controllers/logoutController');


router.get('/', handleUserLogOut);

module.exports = router;