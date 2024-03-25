// external imports
const bcrypt = require("bcrypt");


// internal imports
const User = require("../models/People");

// rendering the user page 
const getUsers = async (req, res) => {
try {
    // Get all the user
    const allusers = await User.find({}, { password: 0 });
    res.render('users', {
        title : "Users Page",
        allusers
    })
} catch (error) {
    console.log(error)
}
}

// To save the user
const addUser = async (req, res) => {
try {
    const {name, email, mobile, password} = req.body ;
    const files = req.files ;
    let newUser ;
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
    }  else {
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

module.exports = {
getUsers,
addUser
}