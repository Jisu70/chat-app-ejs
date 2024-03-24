const getUsers = (req, res) => {
    try {
        res.render('users', {
            title : "Users Page"
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getUsers
}