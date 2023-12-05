const express = require('express');
const loginRouter = express.Router();
const login = require('../controllers/login');
const forgotPassword = require('../controllers/newPassword');

loginRouter.post('/',async (req,res)=>{
    const result = await login(req);
    res.status(result.code).json(result);
});
loginRouter.post('/forgotpassword',async (req,res)=>{
    const result = await forgotPassword(req);
    res.status(result.code).json(result);
});
module.exports = loginRouter;