const express = require('express');
const useroperationsRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {follow, search, followerrequest, liked, addcoment} = require('../controllers/followers');

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
useroperationsRouter.post('/',async(req,res)=>{
    res.json();
})
useroperationsRouter.post('/',async(req,res)=>{
    res.json();
})
useroperationsRouter.post('/',async(req,res)=>{
    res.json();
})
module.exports = useroperationsRouter;