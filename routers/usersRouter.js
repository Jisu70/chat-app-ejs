// Importing express
const express = require('express');
const { getUsers, addUser, deleteUser } = require('../controllers/usersController.js');
// File upload middleware
const { avatarUpload } = require("../middlewares/users/avatarUpload.js")
const { addUserValidators,   addUserValidationHandler} = require("../middlewares/users/userValidator.js")


const router = express.Router();

// To rendering the page and showing all users 
router.get('/', getUsers);
// To save the user 
router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser );
// To Delete the user 
router.delete('/:userId', deleteUser) ;
module.exports = router;