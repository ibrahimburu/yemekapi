const express = require('express');
const discovredRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const requestdiscovred = require('../controllers/discoverd');
discovredRouter.get('/',auth,async(req,res)=>{
    const result = await requestdiscovred(req);
    res.status(result.code).json(result);
})
module.exports = discovredRouter;