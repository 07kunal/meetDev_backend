// Created the logic to authenticate the admin. 
let adminAuth = (req, res, next) => {
    console.log('Testing_middleware');
    let authTokken = '12345';
    if (authTokken === '12345') {
        next();
    } else {
        res.status(401).send('Admin is not autharised');
    }
}
module.exports = {
    adminAuth
}