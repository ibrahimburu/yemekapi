const express = require('express');
const postRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const{addpost, postedit} = require('../controllers/post');

postRouter.post('/', auth, async(req,res)=>{
    const result = await addpost(req);
    res.status(result.code).json(result);
});
postRouter.put('/', auth, async(req,res)=>{
    const result = await postedit(req);
    res.status(result.code).json(result);
})
module.exports = postRouter;