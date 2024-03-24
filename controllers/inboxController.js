const getInbox = (req, res) => {
    try {
        res.render('inbox', {
            title : "Inbox Page"
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getInbox
}