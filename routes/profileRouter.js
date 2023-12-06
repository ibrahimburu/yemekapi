const express = require('express');
const profileRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {profile} = require('../controllers/profile');
profileRouter.get('/:username',auth,async(req,res)=>{
    const result = await profile(req);
    res.status(result.code).json(result);
})
module.exports = profileRouter;