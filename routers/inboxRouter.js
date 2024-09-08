// Importing express
const express = require('express');
const router = express.Router() ;
const { getInbox, crerateConversation, getMessages, submitMessage } = require('../controllers/inboxController.js')
// Decorate html middleware
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
// Check login middleware
const { checkLogin } = require('../middlewares/common/checkLogin.js')
const { attachmentUpload  } = require('../middlewares/users/attachMentUpload.js')

// Render inbox page
router.get('/', decorateHtmlResponse("Inbox"), checkLogin, getInbox ) ;

// create conversation
router.post('/create-conversation', checkLogin, crerateConversation) ;

// Get message 
router.get('/get-message/:conversation_id',checkLogin, getMessages);

// Submit message 
router.post('/submit-message', attachmentUpload, checkLogin, submitMessage);


module.exports = router ;