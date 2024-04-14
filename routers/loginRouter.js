// Importing express
const express = require('express');
const router = express.Router() ;
const { getLogin, loginUser, logout} = require('../controllers/loginController.js')

// Middlewares
const { loginValidators, loginValidationHandler } = require('../middlewares/login/loginValidators.js');
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { redirectLoggedIn } = require('../middlewares/common/checkLogin.js')

// Render login Page
router.get('/', decorateHtmlResponse("Login Page"), redirectLoggedIn, getLogin ) ;

// Hnadle login Functionality
router.post('/', loginValidators, loginValidationHandler, loginUser ) ;

// logout
router.delete("/", logout);

module.exports = router ;