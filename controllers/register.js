const  {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const {encrypt,decrypt} = require('../hash/crptpass');
const sendmail = require('../nodemailer/sendMail');

const register = async (req,res) =>{
    return new Promise (async(resolve)=>{
        const sql = 'select * from users ';
        resolve(await dbhelper(sql));
    })       
}
const create_newUser = async (req,res) =>{
    return new Promise(async resolve=>{
        try {
            const userName = req.body.username;
            const email = req.body.email;
            const sqlForEmail = 'SELECT * FROM users WHERE email = ?';
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const sqlForRegister = `INSERT INTO users SET ?`;
            const already_registred = await dbhelper(sqlForEmail, email);
            const userName_alreadyHave = await dbhelper(sqlForUserName, userName);
            if((already_registred[0]?.username.length>0)){
                resolve(failure.already_exist);
            }else if(userName_alreadyHave[0]?.username.length>0){
                resolve(failure.user_name_already_exist);
            }else if(userName.length<=4){
                resolve(failure.user_name_to_short);
            }else if(!(req.body.password.length >= 8)){
                resolve(failure.password_must_be_greater_than_eight_characters);
            }else{
                const newUser = {
                    id:req.body.id,
                    username:req.body.username,
                    email:req.body.email,
                    password:encrypt(req.body.password),
                    photo:req.body.photo,
                    bio:"",
                    status:false,
                }
                const registered = await dbhelper(sqlForRegister,newUser);
                if(registered?.protocol41){
                    resolve(successfuly.register_added);
                }
                resolve(registered);
                sendmail(req.body.email,req.body.id);
            }
        } catch (err) {
            resolve(err);
        }
    })
}
module.exports = { register, create_newUser };