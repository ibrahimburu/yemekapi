const { v1: uuidv1 } = require('uuid');
const { dbhelper } = require('../models/database');
const { failure, uccessfuly, successfuly } = require('../responses/responses');
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
module.exports = notifications;