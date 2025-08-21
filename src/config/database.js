const mongoose = require('mongoose');
require('dotenv').config();

/* 
This above URL return the promise hence it's good practice to wrap this function in async func.

- right to to setup the connection with the clustor/db is that,
 - First connect to db
 - then connect to the port at which the application is running. 

*/

const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_Name}:${process.env.DB_pwd}@mo-cluster.dwdljhy.mongodb.net/meedDev`);
}
module.exports = {
    connectDB: connectDB
}