// Importing npm modules
const { check, validationResult } = require("express-validator");

/**
 * This validator is used to validate login inputs from the uer.
 */
const loginValidators = [
    check("emailOrMobile")
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
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
      } else {
        res.render("index", {
            title : "Login page",
            data: {
              username: req.body.emailOrMobile,
            },
            errors: mappedErrors,
          });
      }
}

module.exports = {
    loginValidators,
    loginValidationHandler
}