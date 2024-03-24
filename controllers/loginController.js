const getLogin = (req, res) => {
    try {
        res.render('index', {
            title : "Login Page"
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getLogin
}