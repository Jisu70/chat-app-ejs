// Importing express
const express = require('express');
const router = express.Router() ;
const { getInbox } = require('../controllers/inboxController.js')

router.get('/', getInbox ) ;

module.exports = router ;