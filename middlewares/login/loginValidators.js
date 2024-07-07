// Importing npm modules
const { check, validationResult } = require("express-validator");

/**
 * This validator is used to validate login inputs from the user.
 */
const loginValidators = [
  check("username")
      .isLength({ min: 1 })
      .withMessage("User email or mobile is required")
      .trim(),
  check("password")
      .isLength({ min: 1 })
      .withMessage("Password is required"),
];
/**
 * loginValidationHandler is middleware function is checking error while login.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const loginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  // Extract errors in a readable format
  const errorMessages = errors.array().map(error => ({ [error.path]: error.msg }));
  if (errorMessages.length === 0) {
    next();
  } else {
    res.status(400).json(errorMessages)
  }
}

module.exports = {
    loginValidators,
    loginValidationHandler
}