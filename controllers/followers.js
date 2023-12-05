const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { v1: uuidv1 } = require('uuid');
const notifications = require('../controllers/notifications');
const { upload, uploadmulti } = require('../multer/multer');
const follow = async (req, res) => {
    return new Promise(async (resolve) => {
        const sql = 'INSERT INTO  followers SET ?';
        const sqlForUsername = 'SELECT * FROM users where username = ? ';
        const username = req.body.username;
        const result = await dbhelper(sqlForUsername, username);
        if (result == null) {
            resolve(failure.server_error);
        } else if (result.fatal == true) {
            resolve(failure.user_not_found);
        } else {
            if (req.username == username) {
                resolve(failure.server_error)
            } else {
                const newfollower = {
                    user_id: result[0]?.id,
                    follower_id: req.id,
                    status: false
                };
                const followed = await dbhelper(sql, newfollower);
                if (followed == null || followed.errno != null) {
                    resolve(failure.server_error)
                } else { resolve(successfuly.follow_request_sended); }
            }
        }

    })
};
const followerrequest = async (req, res) => {
    return new Promise(async (resolve) => {
        const sql = 'SELECT * FROM followers WHERE user_id = ? AND status = ?';
        const followrequset = [req.id, false];
        const request = await dbhelper(sql, followrequset);
        if (request == null || request.fatal == true) {//diğer bütün if elsler böyle olmalı
            if (request == null) {
                resolve(failure.no_result);
            } else { resolve(failure.server_error) }
        } else {
            const sqlForUserName = 'select username,photo from users where id = ?';
            let followers = [];
            for(let i= 0;i<request.length;i++){
                    const follower = await dbhelper(sqlForUserName,request[i]?.follower_id);
                    followers[i] = {username:follower[0].username,photo:follower[0].photo}
            }

            const response = {
                message: successfuly.follow_request_showed.message,
                code: successfuly.follow_request_showed.code,
                status: successfuly.follow_request_showed.status,
                users: followers
            }
            resolve(response);
        }
    })
};
const acceptfollowrequest = async (req, res) => {
    return new Promise(async (resolve) => {
        const sql = 'UPDATE followers SET status = true WHERE user_id = ? and follower_id = ?';
        const sqlForUserName = 'select id from users where username = ?';
        const followerid = await dbhelper(sqlForUserName,req.body.username);
        const followrequset = [req.id, followerid[0].id];
        const request = await dbhelper(sql, followrequset);
        if (request == null || request.errno != null) {//diğer bütün if elsler böyle olmalı
            if (request == null) {
                resolve(failure.no_result);
            } else { resolve(failure.server_error) }
        } else {
            resolve(successfuly.follow_request_accepted);
        }
    })
};
const deletefollowrequest = async (req, res) => {//bu yapılacak
    return new Promise(async (resolve) => {
        const sql = 'DELETE FROM followers where user_id = ? AND follower_id = ?';
        const user_id = req.id;
        const sqlForFollowerid = 'SELECT id FROM users WHERE username = ?';
        const follower_id = await dbhelper(sqlForFollowerid,req.body.username);
        const deletedvalues = [user_id,follower_id[0].id];
        const request = await dbhelper(sql, deletedvalues);
        console.log(request)
        if (request == null || request.errno != null) {
                resolve(failure.server_error);
        } else {
            resolve(successfuly.follow_request_deleted);
        }
    })
};
const search = async (req, res) => {
    return new Promise(async (resolve) => {
        const sqlForUsreName = 'SELECT *FROM users WHERE username LIKE ?';
        const name = `${req.body.username}%`;
        const result = await dbhelper(sqlForUsreName, name);
        if (result == null || result.fatal == true) {//diğer bütün if elsler böyle olmalı
            if (result == null) {
                resolve(failure.user_not_found);
            } else { resolve(failure.server_error) }
        } else {
            let users=[];
            for(let i = 0;i<result.length;i++){
                users[i]={username:result[i].username,photo:result[i].photo}
            }
            const response = {
                message: successfuly.comment_added.message,
                code: successfuly.comment_added.code,
                status: successfuly.comment_added.status,
                users: users
            }
            resolve(response);
        }
    })
};
const liked = async (req, res) => {
    return new Promise(async (resolve) => {
        const sql = 'INSERT INTO  likes SET ?';
        const sqlForPostid = 'SELECT * FROM posts where id = ?';
        const postid = req.body.post_id;
        const newlike = {
            id: uuidv1(),
            user_id: req.id,
            post_id: postid,
        };
        const postavailable = await dbhelper(sqlForPostid, postid);
        if (postavailable == null || postavailable.fatal == true) {
            resolve(failure.post_not_found);
        } else {
            const like = await dbhelper(sql, newlike);
            if (like == null || like.fatal == true) {
                resolve(failure.server_error);
            } else {
                resolve(successfuly.like_added);
                const notification = {
                    target: postavailable[0]?.user_id,
                    source: req.id,
                    type: like,//bu ayarlanacak
                }
                notifications(notification);
            }
        }
    })
};
const addcoment = async (req, res) => {
    return new Promise(async (resolve) => {
        const sql = 'INSERT INTO  comments SET ?';
        const sqlForPostid = 'SELECT * FROM posts where id = ?';
        const postid = req.body.post_id;
        const newcomment = {
            id: uuidv1(),
            user_id: req.id,
            post_id: req.body.post_id,
            body: req.body.body
        };
        const postavailable = await dbhelper(sqlForPostid, postid);
        if (postavailable == null || postavailable.fatal == true) {
            resolve(failure.post_not_found);
        } else {
            const comment = await dbhelper(sql, newcomment);
            if (comment == null || comment.fatal == true) {
                resolve(failure.server_error);
            } else {
                resolve(successfuly.comment_added);
                const notification = {
                    target: postavailable[0]?.user_id,
                    source: req.id,
                    type: comment,//bu ayarlanacak
                }
                notifications(notification);
            }
        }
    })
};
const addavatar = async (req, res) => {
    return new Promise(async (resolve) => {
        
        upload(req, res, async function (err) {
            if (err) {
                resolve(failure.avatar_not_added);
            } else {
                const sqlForUpdate = 'UPDATE users SET photo = ? where id = ?';
                const image = req?.file?.filename;
                image == undefined ? resolve(failure.server_error):null;
                const id = req.id;
                const updatevalues = [image,id]
                const addimage = await dbhelper(sqlForUpdate, updatevalues);
                console.log(addimage)
                if (addimage == null || addimage.fatal == true) {
                    resolve(failure.server_error);
                } else {
                    resolve(successfuly.avatar_added);
                }
            }
        })
    })
};
module.exports = { follow, search, followerrequest, liked, addcoment, addavatar, deletefollowrequest, acceptfollowrequest };