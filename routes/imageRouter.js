const express = require('express');
const imagesRouter = express.Router();
const path = require('path')

imagesRouter.get('/:id',express.static(path.join(__dirname,"id")))
module.exports = imagesRouter;