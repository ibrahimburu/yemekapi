const express = require('express');
const registerRouter = express.Router();
const {register, create_newUser, update_username} = require('../controllers/register');
const {auth} = require('../middlewares/authMiddlewares');
registerRouter.get('/', async (req,res)=>{
      res.json(await register());
});

registerRouter.post('/', async (req,res) => {
    res.json(await create_newUser(req));
});
registerRouter.put('/', auth, async (req,res) => {
    res.json( await update_username(req));
})
module.exports = registerRouter;
//şifremi unuttum yapılacak  şifre değiştir yapılacak kullanıcı adı değiştir yapılacak