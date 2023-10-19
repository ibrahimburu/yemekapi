const express = require('express');
const registerRouter = express.Router();
const {register, create_newUser} = require('../controllers/register');

registerRouter.get('/', async (req,res)=>{
      res.json(await register());
});

registerRouter.post('/', async (req,res) => {
    res.json(await create_newUser(req));
});
module.exports = registerRouter;
//şifremi unuttum yapılacak  şifre değiştir yapılacak kullanıcı adı değiştir yapılacak