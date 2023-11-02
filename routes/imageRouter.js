const express = require('express');
const imagesRouter = express.Router();
const path = require('path')

imagesRouter.get('/:id',(req,res)=>{
    const options = {
        root: path.join(__dirname,'..')
    };
    const fileName = `images/${req.params.id}`;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });   
})
imagesRouter.post('/',(req,res)=>{
    console.log(req);
    res.json("hello");
})
module.exports = imagesRouter;