const express = require('express');
const useroperationsRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {follow, search, followerrequest, liked, addcoment, addavatar} = require('../controllers/followers');

useroperationsRouter.post('/like',auth,async(req,res)=>{
    const result = await liked(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/comment',auth,async(req,res)=>{
    const result = await addcoment(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/follow',auth,async(req,res)=>{
    const result = await follow(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/search',auth,async(req,res)=>{
    const result = await search(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/followerequest',auth,async(req,res)=>{
    const result = await followerrequest(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/addavatar',auth,async(req,res)=>{
    const result = await addavatar(req);
    res.status(result.code).json(result);
})
module.exports = useroperationsRouter;