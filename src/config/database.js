const mongoose = require('mongoose');

/* 
mongoose.connect('mongodb+srv://MO-cluster:oDVhIyh8q8hphOV0@mo-cluster.dwdljhy.mongodb.net/

This above URL return the promise hence it's good practice to wrap this function in async func.

*/

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://MO-cluster:oDVhIyh8q8hphOV0@mo-cluster.dwdljhy.mongodb.net/');
}
connectDB().
    then(() => console.log('Connected! to the DB')).
    catch((err) => console.log('err', err))