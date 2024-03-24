// Importing express
const express = require('express');
const router = express.Router() ;
const { getLogin} = require('../controllers/loginController.js')

router.get('/', getLogin ) ;

module.exports = router ;