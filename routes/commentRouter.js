const express = require('express');
const commentRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const {addcomment, addcommentlike, showcomment, deletecomment, addcommentReply, showcommentreply} = require('../controllers/comment');

commentRouter.get('/:id', auth, async(req,res)=>{
    const result = await showcomment(req);
    res.status(result.code).json(result);
})
commentRouter.post('/addcomment', auth, async(req,res)=>{
    const result = await addcomment(req);
    res.status(result.code).json(result);
})
commentRouter.get('/reply/:id', auth, async(req,res)=>{
    const result = await showcommentreply(req);
    res.status(result.code).json(result);
})
commentRouter.post('/addcomment/reply', auth, async(req,res)=>{
    const result = await addcommentReply(req);
    res.status(result.code).json(result);
})
commentRouter.post('/addcommentlike', auth, async(req,res)=>{
    const result = await addcommentlike(req);
    res.status(result.code).json(result);
})
commentRouter.delete('/', auth, async(req,res)=>{
    const result = await deletecomment(req);
    res.status(result.code).json(result);
})

module.exports = commentRouter;