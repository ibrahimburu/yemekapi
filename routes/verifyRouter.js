const express = require('express');
const verifyRouter = express.Router();
const {verify, againMailVerification} = require('../controllers/verify');
verifyRouter.get('/:id',async (req,res) => {
    res.json(await verify(req));
});

verifyRouter.post('/',async (req,res) => {
    res.json(await againMailVerification(req));
});

module.exports = verifyRouter;