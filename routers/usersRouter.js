// Importing express
const express = require('express');
const { getUsers, addUser, deleteUser, searchUser } = require('../controllers/usersController.js');
// File upload middleware
const { avatarUpload } = require("../middlewares/users/avatarUpload.js")
const { addUserValidators,   addUserValidationHandler} = require("../middlewares/users/userValidator.js")
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse.js')
const { checkLogin } = require('../middlewares/common/checkLogin.js')

const router = express.Router();

// To rendering the page and showing all users 
router.get('/', decorateHtmlResponse("Inbox Page"), checkLogin, getUsers);
// To save the user 
router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser );
// To Delete the user 
router.delete('/:userId', deleteUser) ;
// To find the user
router.get('/search-user', searchUser )
module.exports = router;