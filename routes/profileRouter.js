const express = require('express');
const profileRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {myProfile} = require('../controllers/profile');
profileRouter.get('/:username',auth,async(req,res)=>{
    const result = await myProfile(req);
    res.status(result.code).json(result);
})
module.exports = profileRouter;