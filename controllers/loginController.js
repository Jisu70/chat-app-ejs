// Npm modules
const bcrypt = require('bcrypt') ;
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// Import Model
const People = require('../models/People')


const getLogin = (req, res) => {
    try {
        res.render('index', {
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status : "error",
            message : "There was a problem."
        })
    }
}

// save user 
const loginUser = async (req, res) => {
    console.log("Body", req.body);
    try {
        const { username, password } = req.body ;
        
        const isUser = await People.findOne({ 
            $or: [{ mobile : username }, { email : username}],
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
        const {_id, name , email, mobile, avatar} = isUser ;
        const userObject = {
            _id,
            name,
            email,
            mobile,
            avatar
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
        res.status(200).json({
            status : "ok",
            message : "Logged In Successfully. 🚀"
        });
       
    } catch (error) {
        console.log(error);
        res.render("index", {
            data: {
                username
            },
            errors: {
              common: {
                msg: error.message,
              },
            },
        });
    }
}

// Logout user
function logout(req, res) {
    try {
        res.clearCookie(process.env.COOKIE_NAME);
        res.status(200).json({
            status : "ok",
            message : "Logged out successfully. 🚀"
        });
        
    } catch (error) {
        console.log(error);
    }
  }
  
module.exports = {
    getLogin,
    loginUser,
    logout
}