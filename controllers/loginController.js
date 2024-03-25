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
const saveUser = (req, res) => {
    console.log("Got clicked");
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status : "error",
            message : "there was a problem to handle your request"
        })
    }
}


module.exports = {
    getLogin
}