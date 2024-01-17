const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { encrypt, decrypt } = require('../hash/crptpass');
const { sendmail } = require('../nodemailer/sendMail');
const { v1: uuidv1 } = require('uuid');
const {generateRefreshToken} = require('../hash/jsonwebtoken');

const register = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql1 = `update users set status=true `;
            const posts = await dbhelper(sql1);
            if (posts == "") { console.log("buradadaa") }
            console.log(posts)
            resolve(successfuly.account_verified)
        } catch (error) {
            console.log(error)
            resolve(failure.account_not_found)
            return
        }
    })
}
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
function cleanAndValidate(input) {
    const trimmedInput = input.trim();
    const allowedCharactersRegex = /^[a-z0-9_.ğüşıöçĞÜŞİÖÇ]+$/i;
    return allowedCharactersRegex.test(trimmedInput);
}
const create_newUser = async (req, res) => {
    return new Promise(async resolve => {
        try {
            const userName = req.body.username;
            userName.toLocaleLowerCase('tr-TR')
            const email = req.body.email;
            const sqlForEmail = 'SELECT * FROM users WHERE email = ?';
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const sqlForRegister = `INSERT INTO users SET ?`;
            const already_registred = await dbhelper(sqlForEmail, email);
            const userName_alreadyHave = await dbhelper(sqlForUserName, userName);
            if ((already_registred[0]?.username.length > 0)) {
                resolve(failure.already_exist);
            } else if (!cleanAndValidate(userName)) {
                resolve(failure.wrong_character)
            } else if (userName_alreadyHave[0]?.username.length > 0) {
                resolve(failure.user_name_already_exist);
            } else if (userName.length <= 4) {
                resolve(failure.user_name_to_short);
            } else if (!(req.body.password.length >= 8)) {
                resolve(failure.password_must_be_greater_than_eight_characters);
            } else if (validateEmail(email) == null) {
                resolve(failure.wrong_email);
            } else {
                const newUser = {
                    id: uuidv1(),
                    username: userName.toLocaleLowerCase('tr-TR'),
                    email: req.body.email,
                    password: encrypt(req.body.password),
                    photo: req.body.photo,
                    bio: "",
                    status: false,
                }
                const registered = await dbhelper(sqlForRegister, newUser);
                if (registered?.protocol41) {
                    const result = await sendmail(req.body.email, newUser.id);
                    if (result.code == successfuly.email_sended.code) {
                        resolve(successfuly.register_added_and_email_sended);
                    } else {
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
const update_username = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForid = 'SELECT * FROM users WHERE id = ?';
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const sqlForUpdate = 'UPDATE users SET username = ? where id = ?';
            const sqlForDeleteToken = `DELETE FROM token where token = ?`;
            const sqlForToken = `INSERT INTO token SET ?`
            const userid = req.id;
            const username = req.username;
            if(req.body.username == undefined){resolve(failure.server_error);return}
            const newusername = req.body.username.toLocaleLowerCase('tr-TR');
            const user = await dbhelper(sqlForid, userid);
            if (user != "") {
                if (cleanAndValidate(newusername)) {
                    if (req.body.username.length > 4) {
                        if (username != newusername) {
                            const already_existt = await dbhelper(sqlForUserName, newusername);
                            if (!(already_existt[0])) {
                                const updateValues = [newusername, req.id];
                                const updateusername = await dbhelper(sqlForUpdate, updateValues);
                                if(updateusername != ""){
                                    const newuser ={
                                        id:req.id,
                                        username:newusername
                                    }
                                    const newToken = generateRefreshToken(newuser);
                                    await dbhelper(sqlForToken,{token:newToken})
                                    const message = {
                                        message:successfuly.user_name_changed.message,
                                        code:successfuly.user_name_changed.code,
                                        status:successfuly.user_name_changed.status,
                                        token:newToken
                                    }
                                    resolve(message);
                                    await dbhelper(sqlForDeleteToken,req.headers.token);
                                }else{
                                    resolve(failure.server_error);
                                    return
                                }
                            } else { resolve(failure.user_name_already_exist); return}
                        } else { resolve(failure.you_must_write_different_username); return}
                    } else { resolve(failure.user_name_to_short); return }
                } else {
                    resolve(failure.wrong_character); return
                }
            } else { resolve(failure.account_not_found); return}
        } catch (error) {
            resolve(error);
        }
    });
}
module.exports = { register, create_newUser, update_username };
