const jwt = require('jsonwebtoken');
const {failure} = require('../responses/responses');
const {dbhelper} = require('../models/database');
require('dotenv').config();
const auth = async(req,res,next) => {
    const token = req.headers.token;
    if(token){
        try {
            const sqlFortoken = 'SELECT * FROM token WHERE token = ?';
            const tokenexist =await dbhelper(sqlFortoken,token);
            if(tokenexist==''){
              res.status(failure.you_must_be_login.code).json(failure.you_must_be_login);
            }else{
              const decoded = jwt.verify(token, process.env.SCREETKEY);
              req.id=decoded.id;
              req.username=decoded.username;
            next();
            }
          } catch (error) {
            res.status(failure.server_error.code).json(failure.server_error);
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
            res.status(failure.wrong_token.code).json(failure.wrong_token);
          }
    }else {
        res.status(failure.you_must_be_login.code).json(failure.you_must_be_login);
    }
    
}
module.exports = {auth, authForPassword};