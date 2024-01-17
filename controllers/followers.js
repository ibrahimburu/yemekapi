const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { notifications } = require('../controllers/notifications');
const { upload, uploadmulti } = require('../multer/multer');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.IMAGEURL;
const follow = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqForDeleteFollowRequest = `DELETE FROM followers WHERE follower_id = ? AND user_id = ?`;
            const sql = `INSERT INTO followers SET ?`;
            const sqlForUsername = 'SELECT * FROM users where username = ? ';
            const sqlForFollowed = `SELECT * FROM followers WHERE follower_id = ? AND user_id = ?`;
            const username = req.body.username;
            const result = await dbhelper(sqlForUsername, username);
            if (result == "") {
                resolve(failure.user_not_found);
                return
            } else {
                if (req.username == username) {
                    resolve(failure.server_error)
                    return
                } else {
                    const alreadyfollowed = await dbhelper(sqlForFollowed, [req.id, result[0]?.id]);
                    if (alreadyfollowed == "") {
                        const newfollower = {
                            user_id: result[0]?.id,
                            follower_id: req.id,
                            status: false
                        };
                        const followed = await dbhelper(sql, newfollower);
                        if (followed == "") {
                            resolve(failure.server_error);
                            return
                        }
                        resolve(successfuly.follow_request_sended);
                        const notification = {
                            target: result[0]?.id,
                            source: req.id,
                            type: "follow",
                            body: "follow"
                        }
                        notifications(notification);
                        return
                    } else {
                        const deletefollowrequest = await dbhelper(sqForDeleteFollowRequest, [req.id, result[0]?.id])
                        if (deletefollowrequest == "") { resolve(failure.server_error); return }
                        resolve(successfuly.follow_request_deleted);
                        return
                    }

                }
            }
        } catch (error) {
            console.log(error)
            resolve(failure.server_error)
            return
        }


    })
};
const followerrequest = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = 'SELECT * FROM followers WHERE user_id = ? AND status = ? ORDER BY created_at DESC';
            const followrequset = [req.id, false];
            const request = await dbhelper(sql, followrequset);
            if (request == "") {
                resolve(successfuly.there_is_nothing_to_show);
            } else {
                const sqlForUserName = 'select username,photo from users where id = ?';
                let followers = [];
                for (let i = 0; i < request.length; i++) {
                    const follower = await dbhelper(sqlForUserName, request[i]?.follower_id);
                    followers.push({ username: follower[0].username, photo: url + follower[0].photo })
                }
                const response = {
                    message: successfuly.follow_request_showed.message,
                    code: successfuly.follow_request_showed.code,
                    status: successfuly.follow_request_showed.status,
                    users: followers
                }
                resolve(response);
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }

    })
};
const acceptfollowrequest = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = 'UPDATE followers SET status = true WHERE user_id = ? and follower_id = ?';
            const sqlForUserName = 'select id from users where username = ?';
            const followerid = await dbhelper(sqlForUserName, req.body.username);
            const followrequset = [req.id, followerid[0].id];
            const request = await dbhelper(sql, followrequset);
            if (request == "") {
                resolve(failure.server_error);
                return
            } else {
                resolve(successfuly.follow_request_accepted);
                return
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
};
const followers = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForFollowers = `SELECT username,photo FROM users WHERE id IN (SELECT follower_id FROM followers WHERE user_id = ? AND status = true)`;
            const followers = await dbhelper(sqlForFollowers, req.id);
            if (followers == "") {
                resolve(successfuly.there_is_nothing_to_show)
            } else {
                let i;
                for (i = 0; i < followers.length; i++) {
                    followers[i].photo = url + followers[i].photo
                }
                const response = {
                    message: successfuly.followers_showed.message,
                    code: successfuly.followers_showed.code,
                    status: successfuly.followers_showed.status,
                    users: followers
                }
                resolve(response);
            }

        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
        }
    })
}
const followed = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForFollowers = `SELECT username,photo FROM users WHERE id IN (SELECT user_id FROM followers WHERE follower_id = ? AND status = true)`;
            const followed = await dbhelper(sqlForFollowers, req.id);
            if (followed == "") {
                resolve(successfuly.there_is_nothing_to_show)
            } else {
                let i;
                for (i = 0; i < followed.length; i++) {
                    followed[i].photo = url + followed[i].photo
                }
                const response = {
                    message: successfuly.followed_showed.message,
                    code: successfuly.followed_showed.code,
                    status: successfuly.followed_showed.status,
                    users: followed
                }
                resolve(response);
            }

        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
        }
    })
}
const deletefollowrequest = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = 'DELETE FROM followers where user_id = ? AND follower_id = ? AND status = false';
            const user_id = req.id;
            const sqlForFollowerid = 'SELECT id FROM users WHERE username = ?';
            const follower_id = await dbhelper(sqlForFollowerid, req.body.username);
            const deletedvalues = [user_id, follower_id[0].id];
            const request = await dbhelper(sql, deletedvalues);
            if (request == "") {
                resolve(failure.server_error);
                return
            } else {
                resolve(successfuly.follow_request_deleted);
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
};

const search = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForUsreName = 'SELECT * FROM users WHERE username LIKE ?';
            const name = `${req.body.username}%`;
            if (name == '%') {
                const response = {
                    message: successfuly.there_is_nothing_to_show.message,
                    code: successfuly.there_is_nothing_to_show.code,
                    status: successfuly.there_is_nothing_to_show.status,
                    users: []
                }
                resolve(response);
                return
            }
            const result = await dbhelper(sqlForUsreName, name);
            if (result == "") {
                resolve(successfuly.there_is_nothing_to_show);
                return
            } else {
                let users = [];
                for (let i = 0; i < result.length; i++) {
                    users[i] = { username: result[i].username, photo: url + result[i].photo }
                }
                const response = {
                    message: successfuly.comment_added.message,
                    code: successfuly.comment_added.code,
                    status: successfuly.comment_added.status,
                    users: users
                }
                resolve(response);
                return
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
};
const searchByPostTitle = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForPostTitle = 'SELECT * FROM posts WHERE title LIKE ?';
            const sqlForPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
            const title = `%${req.body.title}%`;
            if (title == '%%') {
                const response = {
                    message: successfuly.there_is_nothing_to_show.message,
                    code: successfuly.there_is_nothing_to_show.code,
                    status: successfuly.there_is_nothing_to_show.status,
                    posts: []
                }
                resolve(response);
                return
            }
            const result = await dbhelper(sqlForPostTitle, title);
            if (result == "") {
                resolve(successfuly.there_is_nothing_to_show);
                return
            } else {
                let posts = [];
                for (let i = 0; i < result.length; i++) {
                    const photo = await dbhelper(sqlForPhoto, result[i].id);
                    const photosource = photo.map(({ source }) => url + source);
                    posts[i] = { post_id: result[i].id, post_title: result[i].title, post_images: [photosource[0]] }
                }
                const response = {
                    message: successfuly.comment_added.message,
                    code: successfuly.comment_added.code,
                    status: successfuly.comment_added.status,
                    posts: posts
                }
                resolve(response);
                return
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
};
const searchByMaterial = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForMaterialTitle = 'SELECT * FROM material WHERE title LIKE ?';
            const sqlForPost = `SELECT * FROM posts WHERE id = ?`;
            const sqlForPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
            const title = `%${req.body.title}%`;
            if (title == '%%') {
                const response = {
                    message: successfuly.there_is_nothing_to_show.message,
                    code: successfuly.there_is_nothing_to_show.code,
                    status: successfuly.there_is_nothing_to_show.status,
                    posts: []
                }
                resolve(response);
                return
            }
            const result = await dbhelper(sqlForMaterialTitle, title);
            if (result == "") {
                resolve(successfuly.there_is_nothing_to_show);
                return
            } else {
                let posts = [];
                for (let i = 0; i < result.length; i++) {
                    const post = await dbhelper(sqlForPost, result[i].post_id)
                    const photo = await dbhelper(sqlForPhoto, result[i].post_id);
                    const photosource = photo.map(({ source }) => url + source);
                    posts[i] = { post_id: result[i].id, post_title: post[0].title, post_images: [photosource[0]] }
                }
                const response = {
                    message: successfuly.comment_added.message,
                    code: successfuly.comment_added.code,
                    status: successfuly.comment_added.status,
                    posts: posts
                }
                resolve(response);
                return
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
};
const liked = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = 'INSERT INTO likes SET ?';
            const sqlForPostid = 'SELECT * FROM posts where id = ?';
            const sqlForLike = `SELECT * FROM likes where user_id = ? AND post_id = ?`;
            const sqlForDeleteLike = `DELETE FROM likes where user_id = ? AND post_id = ?`;
            const postid = req.body.post_id;
            const postavailable = await dbhelper(sqlForPostid, postid);
            if (postavailable == "") {
                resolve(failure.post_not_found);
            } else {
                const alreadyLiked = await dbhelper(sqlForLike, [req.id, postid]);
                if (alreadyLiked != "" | null | undefined) {
                    const deleteLike = await dbhelper(sqlForDeleteLike, [req.id, postid]);
                    if (deleteLike == "") {
                        resolve(failure.server_error);
                        return
                    } else {
                        resolve(successfuly.unliked);
                    }
                } else {
                    const newlike = {
                        user_id: req.id,
                        post_id: postid,
                    };
                    const like = await dbhelper(sql, newlike);
                    if (like == "") {
                        resolve(failure.server_error);
                    } else {
                        const notification = {
                            target: postavailable[0]?.user_id,
                            source: req.id,
                            type: "post_like",
                            body: postavailable[0]?.id
                        }
                        if (notification.target != notification.source) {
                            notifications(notification);
                        }
                        resolve(successfuly.like_added);
                    }
                }
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }
    })
};
const addavatar = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            //HATİCE PROFİL FOTOĞRAFINI DEĞİŞEMİYECEK
            if (req.id == "0b9d9ba0-982e-11ee-94bd-53ec383d677b") {
                resolve(failure.server_error);
                return
            }
            upload(req, res, async function (err) {
                if (err) {
                    resolve(failure.avatar_not_added);
                } else {
                    const sqlForUpdate = 'UPDATE users SET photo = ? where id = ?';
                    const image = req?.file?.filename;
                    image == undefined ? resolve(failure.server_error) : null;
                    const id = req.id;
                    const updatevalues = [image, id]
                    const addimage = await dbhelper(sqlForUpdate, updatevalues);
                    if (addimage == "") {
                        resolve(failure.server_error);
                        return
                    } else {
                        resolve(successfuly.avatar_added);
                        return
                    }
                }
            })
        } catch (error) {
            resolve(failure.server_error);
        }

    })
};
const updatebio = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForBio = `UPDATE users SET bio = ? WHERE id = ?`;
            const bio = req.body?.bio;
            const updateBio = await dbhelper(sqlForBio, [bio, req.id]);
            if (updateBio == "") {
                resolve(failure.server_error);
                return
            } else {
                resolve(successfuly.bio_updated);
                return
            }

        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
}
module.exports = { follow, search, followerrequest, liked, addavatar, deletefollowrequest, acceptfollowrequest, followers, followed, updatebio, searchByPostTitle, searchByMaterial };