const express = require('express');
const postdetailsRouter = express.Router();
const { auth } = require('../middlewares/authMiddlewares');
const {postdetails} = require('../controllers/postdetails');

postdetailsRouter.get('/:id',auth,async(req,res)=>{
    const result = await postdetails(req);
    res.status(result.code).json(result);
})
module.exports = postdetailsRouter;