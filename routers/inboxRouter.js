// Importing express
const express = require('express');
const router = express.Router() ;
const { getInbox, crerateConversation, getMessage } = require('../controllers/inboxController.js')
// Decorate html middleware
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
// Check login middleware
const { checkLogin } = require('../middlewares/common/checkLogin.js')

// Render inbox page
router.get('/', decorateHtmlResponse("Inbox"), checkLogin, getInbox ) ;

// create conversation
router.post('/create-conversation', checkLogin, crerateConversation) ;

// Get message 
router.post('/get-message', getMessage)


module.exports = router ;