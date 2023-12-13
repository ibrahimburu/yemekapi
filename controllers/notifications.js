const { v1: uuidv1 } = require('uuid');
const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const notifications = async (notification) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForNotification = 'INSERT INTO notifications SET ?'
            const addnotification = {
                id: uuidv1(),
                target: notification.target,
                source: notification.source,
                type: notification.type,
                body: notification.body,
                status: false
            }
            const result = await dbhelper(sqlForNotification, addnotification);
            if (result == null) {
                resolve(failure.server_error);
            } else if (result.fatal == true) {
                resolve(failure.server_error);
            } else {
                resolve(successfuly.post_adedd);
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
}
const showNotifications = async (req,res)=>{
    return new Promise(async(resolve) => {
        const sqlForNotification = `SELECT * FROM notifications WHERE target = ?`;
        const sqForUpdateNotification = `UPDATE notifications SET status = true WHERE id = ?`;
        const sqlForUser = `SELECT username,photo FROM users WHERE id = ?`;
        const notification = await dbhelper(sqlForNotification,req.id);
        if(notification == ""){
            resolve(successfuly.there_is_nothing_to_show);
            return
        }
        let i;
        let response = [];
        for(i=0;i<notification.length;i++){
            const source = await dbhelper(sqlForUser,notification[i]?.source);
            response.push({
                type:notification[i].type,
                user_name:source[0].username,
                user_avatar:source[0].photo,
                body:notification[i].body,
                status:notification[i].status
            })
            if(notification[i].status==false){
                await dbhelper(sqForUpdateNotification,notification[i].id)
            }
        }
        let result={
            message:successfuly.Notifications_showed.message,
            code:successfuly.Notifications_showed.code,
            status:successfuly.Notifications_showed.status,
            notifications:response
        }
        resolve(result)
    })
}
module.exports = {notifications, showNotifications};