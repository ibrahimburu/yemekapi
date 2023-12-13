const express = require('express');
const hompageRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const requesthompage = require('../controllers/hompage');

hompageRouter.get('/',auth,async(req,res)=>{
    const result = await requesthompage(req);
    res.status(result.code).json(result);
})
module.exports = hompageRouter;