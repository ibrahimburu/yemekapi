const {dbhelper} = require('../models/database');
const {sendmail_forpassword} = require('../nodemailer/sendMail');
const {failure, successfuly} = require('../responses/responses');
const {generatePasswordResetToken} = require('../hash/jsonwebtoken');
const {encrypt} = require('../hash/crptpass');

const forgot_password = async (req,res) => {
    return new Promise(async (resolve) =>{
        try {
            const sqlForEmail = 'SELECT * FROM users WHERE email = ?';
            const email = req.body.email;
            const result = await dbhelper(sqlForEmail,email);
            if(result == ""){
                    resolve(failure.account_not_found); return
            }else{
               const token = generatePasswordResetToken(result[0]);
               const sendmail = await sendmail_forpassword(result[0]?.email,token);
               if(sendmail.code==successfuly.email_sended.code){
                resolve(successfuly.email_sended);
               }else{resolve(failure.email_not_send);}
            }
        } catch (error) {
            resolve(error)
        }
    })
}
const changed_password = async (req,res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForId = 'SELECT * FROM users WHERE id = ?';
            const id = req.id;
            const sqlForUpdate = 'UPDATE users SET password = ? WHERE id = ?';
            if(req.body.password.length<8){resolve(failure.password_must_be_greater_than_eight_characters);return}
            const updateValues = [encrypt(req.body.password), req.id];
            const result = await dbhelper(sqlForId,id);
            if(result==""){
                    resolve(failure.account_not_found);
            }else{
                if(encrypt(req.body.password)!=result[0]?.password){
                    const change = await dbhelper(sqlForUpdate,updateValues);
                    if(change==""){resolve(failure.server_error);}else{resolve(successfuly.password_changed)}
                }else{resolve(failure.Your_new_password_cannot_be_the_same_as_your_old_password);}
            }
        } catch (error) {
            resolve(failure.server_error);return
        }

    })
}
module.exports = {forgot_password, changed_password};