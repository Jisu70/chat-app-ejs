// Importing express
const express = require('express');
const { getUsers, addUser } = require('../controllers/usersController.js');
// File upload middleware
const { avatarUpload } = require("../middlewares/users/avatarUpload.js")
const { addUserValidators,   addUserValidationHandler} = require("../middlewares/users/userValidator.js")


const router = express.Router();

router.get('/', getUsers);

router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser );

module.exports = router;