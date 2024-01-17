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
            const sqlForFCMToken = `SELECT * FROM info WHERE user_id = ?`;
            const sqlForDeleteInfo = `DELETE FROM info WHERE user_id = ?`;
            const sqlForAlreadyNotificationSended = `SELECT * FROM notifications WHERE target = ? AND source = ? AND type = ? AND body = ?`;
            const sqlforusername = `SELECT username FROM users WHERE id = ?`;
            const sqlForPostPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
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
                const sourceName = await dbhelper(sqlforusername, addnotification.source);
                let message;
                if (addnotification.type == "follow") {
                    message = {
                        title: sourceName[0].username,
                        body: 'seni takip etmek istiyor',
                        imageUrl: url
                    }
                } else if (addnotification.type == "post_like") {
                    const photo = await dbhelper(sqlForPostPhoto, notification.body);
                    message = {
                        title: sourceName[0].username,
                        body: 'bir gönderini beğendi',
                        imageUrl: url + photo[0].source
                    }
                } else if (addnotification.type == "comment_like") {
                    const photo = await dbhelper(sqlForPostPhoto, notification.body);
                    message = {
                        title: sourceName[0].username,
                        body: 'bir yorumunu beğendi',
                        imageUrl: url + photo[0].source
                    }
                } else if (addnotification.type == "comment") {
                    const photo = await dbhelper(sqlForPostPhoto, notification.body);
                    console.log(photo)
                    message = {
                        title: sourceName[0].username,
                        body: 'bir gönderine yorum yaptı',
                        imageUrl: url + photo[0].source
                    }
                }
                const token = await dbhelper(sqlForFCMToken, notification.target);
                let i;
                for (i = 0; i < token.length; i++) {
                    if (token[i].fcm_token == "") {
                        await dbhelper(sqlForDeleteInfo, token[i].user_id)
                    } else {
                        console.log(token[i].fcm_token)
                        if (token[i].fcm_token != "") {
                            sendPushNotification(token[i].fcm_token, message)
                        }
                    }

                }
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
        const lastFollowRequest = `SELECT username FROM users WHERE id = (SELECT follower_id FROM followers WHERE user_id = ? AND status = false ORDER BY created_at DESC LIMIT 1)`;
        await dbhelper(sql);
        const count = await dbhelper(sqlForFollowRequestCount, req.id);
        const notification = await dbhelper(sqlForNotification, req.id);
        const lastFollowRequestName = await dbhelper(lastFollowRequest, req.id);
        if (notification == "") {
            let result = {
                message: successfuly.there_is_nothing_to_show.message,
                code: successfuly.there_is_nothing_to_show.code,
                status: successfuly.Notifications_showed.status,
                count: count[0].count,
                last_follower: lastFollowRequestName[0]?.username,
                notifications: []
            }
            resolve(result);
            return
        }
        let i;
        let response = [];
        for (i = 0; i < notification.length; i++) {
            const source = await dbhelper(sqlForUser, notification[i]?.source);
            if (notification[i].type == 'follow') {
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url + source[0]?.photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at
                })
            } else if (notification[i].type == 'comment') {
                const photo = await dbhelper(sqlForPostPhoto, notification[i].body);
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url + source[0]?.photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at,
                    post_image: url + photo[0].source
                })
            } else if (notification[i].type == 'post_like') {
                const photo = await dbhelper(sqlForPostPhoto, notification[i].body);
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url + source[0]?.photo,
                    body: notification[i].body,
                    status: notification[i].status,
                    created_at: notification[i].created_at,
                    post_image: url + photo[0]?.source
                })
            } else if (notification[i].type == 'comment_like') {
                response.push({
                    type: notification[i].type,
                    user_name: source[0].username,
                    user_avatar: url + source[0]?.photo,
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
            last_follower: lastFollowRequestName[0]?.username,
            notifications: response
        }
        resolve(result)
    })
}
module.exports = { notifications, showNotifications };