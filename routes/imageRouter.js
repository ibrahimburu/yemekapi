const express = require('express');
const imagesRouter = express.Router();
const {succesfuly, failure} = require('../responses/responses')
const path = require('path')

imagesRouter.get('/:id',(req,res)=>{
    const options = {
        root: path.join(__dirname,'..')
    };
    if(req.params.id == 'null'){res.status(failure.server_error.code).json(failure.server_error);return}
    const fileName = `images/${req.params.id}`;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log('Sent:', fileName);
        }
    });   
})
module.exports = imagesRouter;