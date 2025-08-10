const express = require('express');
const app = express();
/* 
Testing multi route handle inside the single route. 
- Multi-route can be possible using next() function , which is given by the express JS. 
- With this, on the same route, two or multi route handler can call. 
- Precaution : if first route handler send the response then it's not possible to send the response on the same URL path with the 2nd route handler. 


Point: 
if the multi handler doesn't have the next() function and if any of the handler doesn't send the response then, it through the error. cause it still looking for the response from the next handler. 
:- Instead of calling multi route handler inside the single route func, we can create diff route func of the same route. 

*/
let rh1 = (req, res, next) => {
    console.log('request-from handler1');
    console.log('request-1 params', req.params);
    console.log('request-1 query', req.query);


    next();
    // res.send({ firstName: 'kunal', lastName: 'gautam' });
}
let rh2 = (req, res, next) => {
    console.log('request-from handler2');
    console.log('request-2 params', req.params);
    console.log('request-2 query', req.query);


    res.send({ firstName: 'kunal', lastName: 'gautam' });
    next();
}
let rh3 = (req, res, next) => {
    console.log('request-from handler3');
    console.log('request-3 params', req.params);
    console.log('request-3 query', req.query);


    res.send({ firstName: 'kunal', lastName: 'gautam' });
}
app.get('/test/:id/:work/:age', rh1);
app.get('/test/:id/:work/:age', rh2);

// Listen all the request at port : 3000
app.listen(3000, () => {
    console.log('Server is running');
});