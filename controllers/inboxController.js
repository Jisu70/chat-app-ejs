const getInbox = (req, res) => {
    try {
        res.render('inbox', {
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getInbox
}