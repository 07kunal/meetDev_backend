const express = require('express');
const app = express();

// handle all the incoming request using handler func
// basically what the server return whenever user target on port:3000
// After adding the route with handler funct that means, when the request is targeting that particular path then only server send the response. 
// structure: app.use('route',requestHandlerFunction);
app.use('/test',(req,res)=>{
    console.log('request',req===global);
    res.send('Testing from the server');
});
// Listen all the request at port : 3000
app.listen(3000,()=>{
    console.log('Server is running');
});