// Dependencies
const mongoose = require('mongoose')

// database connection
const dbConnect = () => {
    try {
        mongoose
          .connect(process.env.MONGO_CONNECTION_STRING)
          .then(() => console.log("database connection successful!"))
          .catch((err) => console.log(err));
    } catch (error) {
        console.log(error)
    }
}
module.exports = dbConnect ;