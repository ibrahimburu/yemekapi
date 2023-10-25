const express = require('express');
const verifyRouter = express.Router();
const {verify, againMailVerification} = require('../controllers/verify');
verifyRouter.get('/:id',async (req,res) => {
    const result = await verify(req);
    res.status(result.code).json(result);
});

verifyRouter.post('/',async (req,res) => {
    const result = await againMailVerification(req);
    res.status(result.code).json(result);
});

module.exports = verifyRouter;