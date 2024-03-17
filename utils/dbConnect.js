// Dependencies
const mongoose = require('mongoose');

// database connection
const dbConnect = () => {
    try {
        const dbName = "chat-app"; 
        const connectionString = process.env.MONGO_CONNECTION_STRING + "/" + dbName;

        mongoose
          .connect(connectionString)
          .then(() => console.log("database connection successful!"))
          .catch((err) => console.log(err));
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbConnect;
