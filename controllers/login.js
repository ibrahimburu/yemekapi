const  {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const {encrypt,decrypt} = require('../hash/crptpass');
const generateAccessToken = require('../hash/jsonwebtoken');
const login = async(req,res)=>{
    return new Promise(async (resolve)=>{
        try {
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const userName = req.body.username;
            const isUser = await dbhelper(sqlForUserName, userName);
            console.log(encrypt("sdvxvxcvxcvdsf"))
                console.log(encrypt("sdvxvxcvxcvdsf"))
                console.log(encrypt(req.body.password));
            console.log(isUser[0])
            //console.log(decrypt(isUser[0]?.password));
            //console.log(isUser[0]?.password);
            if(isUser[0]?.username.length<0){
                resolve(failure.user_name_is_not_exist);
            }else if(isUser[0]?.status==0){
                resolve(failure.account_is_not_verified);
            }else if(isUser[0]?.password!=encrypt(req.body.password)){
                resolve(failure.wrong_password);
            }else{
                const token = generateAccessToken(isUser[0]);
                const sqlForToken = `INSERT INTO users SET ?`;
                dbhelper(sqlForToken,token);
                resolve(successfuly.login_successfuly);

            }
        } catch (error) {
            resolve(error);
        }
        
    })
}
module.exports = login;