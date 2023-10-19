const {dbhelper} = require('../models/database');
const nodemailer = require('../nodemailer/sendMail');
const {failure, successfuly} = require('../responses/responses');
const forgotPassword = async(req,res) => {
    return new promise(async(resolve)=>{
        try {
            const email = req.body.email;
            const sqlForEmail = 'SELECT * FROM users where = ?';
            const isUser = await dbhelper(sqlForEmail, email);
            if(isUser[0]?.username.length > 0){
                nodemailer(isUser[0]?.email, isUser[0]?.id);
                resolve(successfuly.mail_sended);
            }else{
                resolve(failure.account_not_found);
            }
        } catch (error) {
            resolve(error);
        }
    })
}
module.exports = forgotPassword;