const express = require('express');
const passwordRouter=express.Router();
const {forgot_password, changed_password} = require('../controllers/newPassword');
const {authForPassword} = require('../middlewares/authMiddlewares');
passwordRouter.post('/forgotpassword',async (req,res) => {
    res.json(await forgot_password(req));
})
passwordRouter.put('/changedpassword/:token', authForPassword, async (req,res) => {
    res.json(await changed_password(req));
})

module.exports = passwordRouter;