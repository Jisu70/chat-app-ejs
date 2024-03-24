// Importing express
const express = require('express');
const router = express.Router() ;
const { getUsers} = require('../controllers/usersController.js')

router.get('/', getUsers ) ;

module.exports = router ;