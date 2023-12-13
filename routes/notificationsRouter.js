const express = require('express');
const {auth} = require('../middlewares/authMiddlewares');
const {showNotifications} = require('../controllers/notifications');
const notificationsRouter = express.Router();

notificationsRouter.get('/', auth, async(req,res)=>{
    const result = await showNotifications(req);
    res.status(result.code).json(result)
} )


module.exports = notificationsRouter;