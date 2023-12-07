const express = require('express');
const discoverRouter = express.Router();
const {auth} = require('../middlewares/authMiddlewares');
const requestdiscover = require('../controllers/discover');
discoverRouter.get('/',auth,async(req,res)=>{
    const result = await requestdiscover(req);
    res.status(result.code).json(result);
})
module.exports = discoverRouter;