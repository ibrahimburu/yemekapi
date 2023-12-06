const  {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const {encrypt,decrypt} = require('../hash/crptpass');
const {sendmail} = require('../nodemailer/sendMail');
const { v1: uuidv1 } = require('uuid');

const register = async (req,res) =>{
    return new Promise (async(resolve)=>{
        try {
            const sql1 = `update users set status=true `;
            const posts = await dbhelper(sql1);
            if(posts == ""){console.log("buradadaa")}
            console.log(posts)
            resolve(successfuly.account_verified)
        } catch (error) {
            console.log(error)
            resolve( failure.account_not_found)
            return
        }        
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
                    id:uuidv1(),
                    username:req.body.username,
                    email:req.body.email,
                    password:encrypt(req.body.password),
                    photo:req.body.photo,
                    bio:"",
                    status:false,
                }
                const registered = await dbhelper(sqlForRegister,newUser);
                if(registered?.protocol41){
                    const result = await sendmail(req.body.email,newUser.id);
                    if(result.code==successfuly.email_sended.code){
                        resolve(successfuly.register_added_and_email_sended);
                    }else{
                        resolve(successfuly.register_added_but_email_not_send);
                    }
                }
                resolve(registered);
                
            }
        } catch (error) {
            resolve(error);
            return
        }
    })
}
//aynı token ile kullanıcı adı değiştirildiğinde eski kullanıcı adının aynısı tekrar yazılabiliyor
const update_username = async (req,res) =>{
    return new Promise(async (resolve)=>{
        try {
            const sqlForToken ='SELECT * FROM token WHERE token = ?';
            const token = req.body.token;
            const sqlForid = 'SELECT * FROM users WHERE id = ?';
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const sqlForUpdate = 'UPDATE users SET username = ? where id = ?';
            const userid = req.id;
            const username = req.username;
            const isLogin = await dbhelper(sqlForToken,token);
            console.log(isLogin)
            if(isLogin==""){//diğer bütün if elsler böyle olmalı
                    resolve(failure.you_must_be_login);                
            }else{
                const user = await dbhelper(sqlForid,userid);
                if(user[0]?.username.length>0){
                    if(req.body.newusername.length>=4){
                        if(username!=req.body.newusername){
                            const already_existt =await dbhelper(sqlForUserName,req.body.newusername);
                            console.log(!(already_existt[0]))
                            if(!(already_existt[0])){
                                const updateValues = [req.body.newusername, req.id];
                            resolve(await dbhelper(sqlForUpdate, updateValues));
                            }else{resolve(failure.user_name_already_exist);}
                        }else{resolve(failure.you_must_write_different_username);}
                    }else{resolve(failure.user_name_to_short);}
                }else{resolve(failure.account_not_found);}
            }
        } catch (error) {
            resolve(error);
        }
    });
}
module.exports = { register, create_newUser, update_username };
