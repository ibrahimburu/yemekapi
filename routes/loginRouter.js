const express = require('express');
const loginRouter = express.Router();
const login = require('../controllers/login');
const forgotPassword = require('../controllers/newPassword');

loginRouter.get('/',async (req,res)=>{

});
loginRouter.post('/',async (req,res)=>{
    const result = await login(req);
    res.statusCode(result.code).json(result);
});
loginRouter.post('/forgotpassword',async (req,res)=>{
    const result = await forgotPassword(req);
    res.statusCode(result.code).json(result);
});
module.exports = loginRouter;