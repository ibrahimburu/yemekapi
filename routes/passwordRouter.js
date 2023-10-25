const express = require('express');
const passwordRouter=express.Router();
const {forgot_password, changed_password} = require('../controllers/newPassword');
const {authForPassword} = require('../middlewares/authMiddlewares');
passwordRouter.post('/forgotpassword',async (req,res) => {
    const result = await forgot_password(req);
    res.statusCode(result.code).json(result);
})
passwordRouter.put('/changedpassword/:token', authForPassword, async (req,res) => {
    const result = await changed_password(req);
    res.statusCode(result.code).json(result);
})

module.exports = passwordRouter;