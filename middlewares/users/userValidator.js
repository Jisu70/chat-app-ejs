// external imports
const { check, validationResult } = require("express-validator");
const path = require("path");
const { unlink } = require("fs");

// user model
const User = require("../../models/People");


/**
 * addUserValidators is validator that validates user's input while signup.
 */
const addUserValidators = [
    check("name")
      .isLength({ min: 1 })
      .withMessage("Name is required")
      .isAlpha("en-US", { ignore: " -" })
      .withMessage("Name must not contain anything other than alphabet")
      .trim(),
    check("email")
      .isEmail()
      .withMessage("Invalid email address")
      .trim()
      .custom(async (value) => {
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            throw createError("Email already is use!");
          }
        } catch (err) {
          throw createError(err.message);
        }
      }),
    check("mobile")
      .isMobilePhone()
      .withMessage("Mobile number must be a valid Indian mobile number")
      .custom(async (value) => {
        try {
          const user = await User.findOne({ mobile: value });
          if (user) {
            throw createError("Mobile already is use!");
          }
        } catch (err) {
          console.log(err);
          throw createError(err.message);
        }
      }),
    check("password")
      .isStrongPassword()
      .withMessage(
        "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
      ),
];
/**
 * addUserValidationHandler is middleware function is checking error while adding a new user, in this process if any error occured it will unlink the uploaded file.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const addUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      // remove uploaded files
      if (req.files.length > 0) {
        const { filename } = req.files[0];
        unlink(
          path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
          (err) => {
            if (err) console.log(err);
          }
        );
      }
  
      // response the errors
      res.status(500).json({
        errors: mappedErrors,
      });
    }
  };

  module.exports = {
    addUserValidators,
    addUserValidationHandler
  };