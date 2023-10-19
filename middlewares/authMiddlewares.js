const jwt = require('jsonwebtoken');
const {failure} = require('../responses/responses');
require('dotenv').config();
const auth = (req,res) => {
    const token = req.body.token;
    if(token){
        jwt.verify(token,process.env.SCREETKEY, async(err,decodedToken) => {
            if(err){
                res.json(failure.token_wrong);
            }else{
                const id = decodedToken.data;
                req.id = id;
                next();
            }
        })
    }else {
        res.json(failure.must_be_login);
    }
    
}