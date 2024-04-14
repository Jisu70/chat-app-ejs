// Importing express
const express = require('express');
const router = express.Router() ;
const { getInbox } = require('../controllers/inboxController.js')
// Decorate html middleware
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
// Check login middleware
const { checkLogin } = require('../middlewares/common/checkLogin.js')

router.get('/', decorateHtmlResponse("Inbox"), checkLogin, getInbox ) ;

module.exports = router ;