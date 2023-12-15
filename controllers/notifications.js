const { v1: uuidv1 } = require('uuid');
const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { sendPushNotification } = require('../firebase/firebase');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.IMAGEURL;
const notifications = async (notification) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForNotification = 'INSERT INTO notifications SET ?';
            const sqlForFCMToken = `SELECT fcm_token FROM info WHERE user_id = ?`;
            const sqlForAlreadyNotificationSended = `SELECT * FROM notifications WHERE target = ? AND source = ? AND type = ? AND body = ?`;
            const addnotification = {
                id: uuidv1(),
                target: notification.target,
                source: notification.source,
                type: notification.type,
                body: notification.body,
                status: false
            }
            const alreadyNotificationSended = await dbhelper(sqlForAlreadyNotificationSended, [addnotification.target, addnotification.source, addnotification.type, addnotification.body]);
            if (alreadyNotificationSended == "") {
                console.log("push")
                // const token = await dbhelper(sqlForFCMToken, notification.target);
                // if (token != "") { sendPushNotification(token[0].fcm_token, addnotification); }
            }
            const result = await dbhelper(sqlForNotification, addnotification);
            if (result == "") {
                resolve(failure.server_error);
            } else {
                resolve(successfuly.notification_sended);
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
}
const showNotifications = async (req, res) => {
    return new Promise(async (resolve) => {
        const sqlForNotification = `SELECT * FROM notifications WHERE target = ? ORDER BY created_at DESC`;
        const sqForUpdateNotification = `UPDATE notifications SET status = true WHERE id = ?`;
        const sqlForUser = `SELECT username,photo FROM users WHERE id = ?`;
        const sql = `DELETE n1 FROM notifications n1 JOIN notifications n2 ON n1.target = n2.target AND n1.source = n2.source AND n1.type = n2.type AND n1.body = n2.body AND n1.created_at < n2.created_at`;
        const sqlForPostPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
        const sqlForFollowRequestCount = `SELECT COUNT(*) AS count FROM followers WHERE user_id = ? AND status = false `;
        const lastFollowRequest = `SELECT username FROM users WHERE id in (SELECT follower_id FROM followers WHERE user_id = ? AND status = false ORDER BY created_at DESC) ORDER BY created_at DESC`;
        await dbhelper(sql);
        const count = await dbhelper(sqlForFollowRequestCount,req.id);
        const notification = await dbhelper(sqlForNotification, req.id);
        const lastFollowRequestName = await dbhelper(lastFollowRequest,req.id);
        if (notification == "") {
            resolve(successfuly.there_is_nothing_to_show);
            return
        }
        let i;
        let response = [];
        for (i = 0; i < notification.length; i++) {
            const source = await dbhelper(sqlForUser, notification[i]?.source);
            if(notification[i].type == 'follow'){
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url+source[0].photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at
                })
            }else if(notification[i].type == 'comment'){
                const photo = await dbhelper(sqlForPostPhoto,notification[i].body);
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url+source[0].photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at,
                    post_image: url + photo[0].source
                })
            }else if(notification[i].type == 'post_like'){
                const photo = await dbhelper(sqlForPostPhoto,notification[i].body);
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url+source[0].photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at,
                    post_image: url + photo[0].source
                })
            }else if(notification[i].type == 'comment_like'){
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url+source[0].photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at
                })
            }
            if (notification[i].status == false) {
                await dbhelper(sqForUpdateNotification, notification[i].id)
            }
        }
        let result = {
            message: successfuly.Notifications_showed.message,
            code: successfuly.Notifications_showed.code,
            status: successfuly.Notifications_showed.status,
            count: count[0].count,
            last_follower:lastFollowRequestName[0]?.username,
            notifications: response
        }
        resolve(result)
    })
}
module.exports = { notifications, showNotifications };