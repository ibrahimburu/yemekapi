const express = require('express');
const useroperationsRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {follow, search, followerrequest, liked, addavatar, acceptfollowrequest, deletefollowrequest, followers, followed, updatebio, searchByPostTitle, searchByMaterial} = require('../controllers/followers');

useroperationsRouter.get('/followers',auth,async (req,res)=>{
    const result = await followers(req);
    res.status(result.code).json(result);
})
useroperationsRouter.get('/followed',auth,async (req,res)=>{
    const result = await followed(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/like',auth,async(req,res)=>{
    const result = await liked(req);
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
useroperationsRouter.post('/searchByPostTitle',auth,async(req,res)=>{
    const result = await searchByPostTitle(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/searchByPostMaterial',auth,async(req,res)=>{
    const result = await searchByPostTitle(req);
    res.status(result.code).json(result);
})
useroperationsRouter.get('/showfollowerequest',auth,async(req,res)=>{
    const result = await followerrequest(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/acceptfollowrequest',auth,async(req,res)=>{
    const result = await acceptfollowrequest(req);
    res.status(result.code).json(result);
})
useroperationsRouter.delete('/deletefollowrequest',auth,async(req,res)=>{
    console.log(req.body.username)
    const result = await deletefollowrequest(req);
    res.status(result.code).json(result);
})
useroperationsRouter.post('/addavatar',auth,async(req,res)=>{
    const result = await addavatar(req);
    res.status(result.code).json(result);
})
useroperationsRouter.put('/updatebio',auth,async(req,res)=>{
    const result = await updatebio(req);
    res.status(result.code).json(result);
})
module.exports = useroperationsRouter;