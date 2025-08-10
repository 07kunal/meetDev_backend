const express = require('express');
const { adminAuth } = require('./middlewares/admin_middleware');
const app = express();
/* 
Error handling can be done using two major approach, 
0 Using try and catch method.
1 making the default error handler to all the routes
*/

// Now need to divert all the request to this middle ware. 
app.use('/admin', adminAuth);
// Get the data

app.get('/admin', (req, res) => {
    throw new Error('23232');
    res.send('Send All the requested data');
});

// Handle the error using the default method called : errorHandle. 
app.use('/',(err,req,res,next)=>{
   if (err) res.send('Something went wrong');
})
// Listen all the request at port : 3000
app.listen(3000, () => {
    console.log('Server is running');
});