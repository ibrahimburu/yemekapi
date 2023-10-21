const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const sendmail = require('../nodemailer/sendMail');
const verify = async (req,res) => {
    return new Promise(async resolve => {
        try {
            const sqlForId = 'SELECT * FROM users WHERE id = ?';
        const id = req.params.id;
        const user = await dbhelper(sqlForId,id);
        if(user[0]?.id){;
            const sql = 'UPDATE users SET status = true WHERE id = ?';
            await dbhelper(sql,id);
            resolve(successfuly.account_verified);
        }
            resolve(failure.account_not_found);
        } catch (error) {
            resolve(error);
        }
        
    })
}
const againMailVerification = async (req,res) => {
    return new Promise(async (resolve)=>{
        try {
            const email = req.body.email;
            const sqlForEmail = 'SELECT * FROM users WHERE email = ?';
            const user = await dbhelper(sqlForEmail,email);
            console.log(user[0]?.username.length)
            if(user[0]?.username.length>0){
                if(user[0]?.status==0){
                    sendmail(req.body.email,user[0]?.id);
                    resolve(successfuly.sent_again);
                }else{
                    resolve(failure.account_already_verified);
                }
            }else{
                resolve(failure.account_not_found);
            }
        } catch (error) {
            resolve(error);
        }
    })
}
module.exports = {verify, againMailVerification};