const express = require('express');
const postRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const{addpost, postedit, deletepost, recordpost, showRecordedPosts, showLikedPosts} = require('../controllers/post');

postRouter.post('/', auth, async(req,res)=>{
    const result = await addpost(req);
    res.status(result.code).json(result);
});
postRouter.delete('/', auth, async(req,res)=>{
    const result = await deletepost(req);
    res.status(result.code).json(result);
});
postRouter.put('/', auth, async(req,res)=>{
    const result = await postedit(req);
    res.status(result.code).json(result);
});
postRouter.post('/recorded', auth, async(req,res)=>{
    const result = await recordpost(req);
    res.status(result.code).json(result);
});
postRouter.get('/recorded', auth, async(req,res)=>{
    const result = await showRecordedPosts(req);
    res.status(result.code).json(result);
});
postRouter.get('/liked', auth, async(req,res)=>{
    const result = await showLikedPosts(req);
    res.status(result.code).json(result);
});
module.exports = postRouter;