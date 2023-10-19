const express = require('express');
const loginRouter = express.Router();
const login = require('../controllers/login');
const forgotPassword = require('../controllers/newPassword');

loginRouter.get('/',async (req,res)=>{

});
loginRouter.post('/',async (req,res)=>{
    res.json(await login(req));
});
loginRouter.post('/forgotpassword',async (req,res)=>{
    res.json(await forgotPassword(req));
});
module.exports = loginRouter;