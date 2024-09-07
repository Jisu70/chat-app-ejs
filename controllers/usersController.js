// external imports
const bcrypt = require("bcrypt");
const path = require('path') ;
const fs = require('fs')

// internal imports
const User = require("../models/People");

// rendering the user page 
const getUsers = async (req, res) => {
    try {
        // Get all the user
        const allusers = await User.find({}, { password: 0 });
        res.render('users', {
            allusers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                msg: "Unknown error occured!",
                },
            },
        });
    }
}

// To save the user
const addUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const files = req.files;
        let newUser;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (files && files.length > 0) {
            newUser = new User({
                name,
                email,
                mobile,
                avatar: files[0].filename,
                password: hashedPassword,
            });
            const result = await newUser.save();
            res.status(200).json({
                message: "User was added successfully!",
            });
        } else {
            newUser = new User({
                name,
                email,
                mobile,
                password: hashedPassword,
            });
            const result = await newUser.save();
            res.status(200).json({
                message: "User was added successfully!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occured!",
                },
            },
        });
    }
}
// To Delete the user
const deleteUser = async (req, res) => {
    console.log("delete function was clicked");
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete({ _id: userId });
        if (deletedUser?.avatar) {
            const filePath = path.join(__dirname, `../public/uploads/avatars/${deletedUser.avatar}`) ;
            fs.unlink(filePath,(err) => {
                if (err) {
                    console.log(err); 
                }
                console.log("File deleted successfully"); 
            })
        }
        res.status(200).json({
            message: "User was deleted successfully!",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            errors: {
                common: {
                msg: "Unknown error occured!",
                },
            },
        });
    }

}

// Find user
const searchUser = async (req, res) => {
    try {
        const { input } = req.query;
        const authenticatedUserId = req.user._id;
        
        // regex search 
        const searchRegex = new RegExp(input, 'i');
        const isUser = await User.find({
            $or: [
                { name: { $regex: searchRegex } }, 
                { email: { $regex: searchRegex } }, 
                { mobile: { $regex: searchRegex } }
            ],
            _id: { $ne: authenticatedUserId }
        }, { password: 0, createdAt : 0, updatedAt : 0, __v : 0 });
        return res.status(200).json({
            status : "ok",
            data : isUser,
            message : "search result fetched successfully."
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {
              common: {
                msg: error.message,
              },
            },
        });
    }
}


module.exports = {
    getUsers,
    addUser,
    deleteUser,
    searchUser
}