// Importing express
const express = require('express');
const router = express.Router() ;
const { getLogin, loginUser} = require('../controllers/loginController.js')

// Render login Page
router.get('/', getLogin ) ;

// Hnadle login Functionality
router.post('/login', loginUser ) ;

module.exports = router ;