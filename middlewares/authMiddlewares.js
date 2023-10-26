const jwt = require('jsonwebtoken');
const {failure} = require('../responses/responses');
require('dotenv').config();
const auth = (req,res,next) => {
    const token = req.headers.token;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.SCREETKEY);
            req.id=decoded.id;
            req.username=decoded.username;
            next();
          } catch (error) {
            res.json(failure.wrong_token);
          }
    }else {
        res.json(failure.you_must_be_login);
    }
    
}
const authForPassword = (req,res,next) => {
    const token = req.params.token;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.SCREETKEY);
            req.id=decoded.id;
            req.username=decoded.username;
            next();
          } catch (error) {
            res.json(failure.wrong_token);
          }
    }else {
        res.json(failure.you_must_be_login);
    }
    
}
module.exports = {auth, authForPassword};