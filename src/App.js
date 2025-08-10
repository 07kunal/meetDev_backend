const express = require('express');
const { adminAuth } = require('./middlewares/admin_middleware');
const app = express();
/* 
Understanding the middle ware . 
- Basically as developer, we don't want to expose our api to the external world,users. Hence
- We need a mechanisms that help us to first authenticate those requestor, then let them get the response from the API. 
- e.g, Just to auth the admin, middle ware can we created just to athenticate all the several request which only make for the admin, URL like, local:3000/admin/getdata

*/

// Now need to divert all the request to this middle ware. 
app.use('/admin', adminAuth);
// Get the data

app.get('/admin', (req, res) => {

    res.send('Send All the requested data');
});
// post the data
app.post('/admin', (req, res) => {

    res.send({
        firstName: 'Kunal',
        lastName: 'Gautam'
    });
});
// Listen all the request at port : 3000
app.listen(3000, () => {
    console.log('Server is running');
});