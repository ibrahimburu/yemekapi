const express = require('express');
const registerRouter = express.Router();
const {register, create_newUser, update_username} = require('../controllers/register');
const {auth} = require('../middlewares/authMiddlewares');
registerRouter.get('/', async (req,res)=>{
    const result = await register(req,res);
      res.status(result.code).json(result);
});

registerRouter.post('/', async (req,res) => {
    const result = await create_newUser(req);
    res.status(result.code).json(result);
});
registerRouter.put('/', auth, async (req,res) => {
    const result = await update_username(req);
    res.status(result.code).json(result);
})
module.exports = registerRouter;
//şifremi unuttum yapılacak  şifre değiştir yapılacak kullanıcı adı değiştir yapılacak