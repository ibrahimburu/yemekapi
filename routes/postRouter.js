const express = require('express');
const postRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const{addpost, postedit} = require('../controllers/post');

postRouter.post('/addpost', auth, async(req,res)=>{
    res.json(await addpost(req));
})
postRouter.put('/postedit', auth, async(req,res)=>{
    res.json(await postedit(req));
})
module.exports = postRouter;