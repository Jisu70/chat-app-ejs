// Npm modules
const bcrypt = require('bcrypt') ;
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// Import Model
const People = require('../models/People')


const getLogin = (req, res) => {
    try {
        res.render('index', {
            title : "Login Page"
        })
    } catch (error) {
        console.log(error)
    }
}

// save user 
const loginUser = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body ;

        if (!emailOrMobile || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email or mobile and password must be provided."
            });
        }
        
        const isUser = await People.findOne({ 
            $or: [{ mobile : emailOrMobile }, { email : emailOrMobile}],
        }) ;
        if (!isUser) {
            return res.status(400).json({
                status : "error",
                message : "No user found with this email or mobile."
            });
        }
        const isMatched = await bcrypt.compare(password, isUser.password );
        if (!isMatched) {
            return res.status(400).json({
                status : "error",
                message : "Wrong password."
            });
        };
        const {name , email, mobile} = isUser ;
        const userObject = {
            name,
            email,
            mobile
        }

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
        });

        // Now storing this jwt token in cookie
        res.cookie(process.env.COOKIE_NAME,token,{
            maxAge: process.env.JWT_EXPIRY,
            httpOnly: true,
            signed: true,
        });

        // Redirect to inbox page
        res.render("inbox",{
            loggedInUser : userObject,
            title : "Inbox page"
        });
    } catch (error) {
        console.log(error);
        res.render("index", {
            data: {
                emailOrMobile
            },
            errors: {
              common: {
                msg: error.message,
              },
            },
        });
    }
}


module.exports = {
    getLogin,
    loginUser
}