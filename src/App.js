const express = require('express');
const app = express();
require('./config/database.js');
// Listen all the request at port : 3000
app.listen(3000, () => {
    console.log('Server is running');
});