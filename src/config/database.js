const mongoose = require('mongoose');

/* 
mongoose.connect('mongodb+srv://MO-cluster:oDVhIyh8q8hphOV0@mo-cluster.dwdljhy.mongodb.net/

This above URL return the promise hence it's good practice to wrap this function in async func.

- right to to setup the connection with the clustor/db is that,
 - First connect to db
 - then connect to the port at which the application is running. 

*/

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://MO-cluster:oDVhIyh8q8hphOV0@mo-cluster.dwdljhy.mongodb.net/');
}
module.exports = {
    connectDB: connectDB
}