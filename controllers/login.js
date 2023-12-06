const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { encrypt } = require('../hash/crptpass');
const { generateRefreshToken } = require('../hash/jsonwebtoken');
const login = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForUserName = 'SELECT * FROM users WHERE username = ?';
            const userName = req.body.username;
            const sqlForToken = `INSERT INTO token SET ?`;
            const isUser = await dbhelper(sqlForUserName, userName);
            if ((isUser[0]?.username == undefined)) {
                resolve(failure.user_name_is_not_exist);
            } else if (isUser[0]?.status == 0) {
                resolve(failure.account_is_not_verified);
            } else if (isUser[0]?.password != encrypt(req.body.password)) {
                resolve(failure.wrong_password);
            } else {
                const token = { token: await generateRefreshToken(isUser[0]) };
                await dbhelper(sqlForToken, token)
                successfuly.login_successfuly['token'] = token.token
                resolve(successfuly.login_successfuly);
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
}
module.exports = login;