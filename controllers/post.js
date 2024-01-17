const { v1: uuidv1 } = require('uuid');
const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { uploadmulti } = require('../multer/multer');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.IMAGEURL;
const addpost = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            uploadmulti(req, res, async function (err) {
                if (err) {
                    resolve(failure.server_error);
                    return
                } else {
                    const post = {
                        id: uuidv1(),
                        title: req.body.title,
                        body: req.body.body,
                        user_id: req.id,
                        status: true
                    }
                    if (post.title == undefined | "" | null) {
                        resolve(failure.server_error)
                        return
                    }

                    const sqlForpsot = `INSERT INTO posts SET ?`;
                    const result = await dbhelper(sqlForpsot, post).then().catch(error => { resolve(failure.server_error); return });
                    if (result == "") {
                        resolve(failure.server_error);
                    } else {
                        addpostimage(req, res, post.id, (err) => {
                            resolve(failure.server_error);
                        });//post eklendikten sonra fotoğraf eklenmezse postu geri sil
                        addpostmaterial(req, res, post.id, (err) => {
                            resolve(failure.server_error);
                        })
                        resolve(successfuly.post_adedd);
                        return
                    }
                }
            })
        } catch (error) {
            resolve(failure.server_error);
            return
        }

    })
}
const recordpost = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = `INSERT INTO recorded_posts SET ?`;
            const sqlForAlreadyRecorded = `SELECT * FROM recorded_posts WHERE post_id = ? AND user_id = ?`;
            const sqlForDeleteRecord = `DELETE FROM recorded_posts WHERE post_id = ? AND user_id = ?`;
            const alreadyRegisted = await dbhelper(sqlForAlreadyRecorded, [req.body?.post_id, req.id]);
            if (alreadyRegisted != "" | null | undefined) {
                const deleteRecord = await dbhelper(sqlForDeleteRecord, [req.body?.post_id, req.id]);
                if (deleteRecord != "") {
                    resolve(successfuly.record_deleted);
                    return
                }
                resolve(failure.server_error);
                return
            }
            const recorded_posts = {
                post_id: req.body.post_id,
                user_id: req.id
            }
            const add = await dbhelper(sql, recorded_posts);
            if (add != "" | null | undefined) {
                resolve(successfuly.record_added)
                return
            }
            resolve(failure.server_error);
            return
        } catch (error) {
            resolve(failure.server_error);
        }
    })
};
const showRecordedPosts = (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sql = `SELECT * FROM recorded_posts WHERE user_id = ?`;
            const sqlForPostPhotos = `SELECT * FROM posts_image WHERE post_id = ?`;
            const sqlForUserId = `SELECT * FROM users WHERE username = ?`;
            const id = await dbhelper(sqlForUserId, req.query.username)
            const recordedPosts = await dbhelper(sql, id[0].id);
            let i;
            let result = [];
            if (recordedPosts == "") { resolve(successfuly.there_is_nothing_to_show); return }
            for (i = 0; i < recordedPosts.length; i++) {
                const postPhoto = await dbhelper(sqlForPostPhotos, recordedPosts[i].post_id);
                result.push({
                    post_id: recordedPosts[i].post_id,
                    post_images: [url + postPhoto[0].source]
                })
            }
            const response = {
                message: successfuly.record_posts_showing.message,
                code: successfuly.record_posts_showing.code,
                status: successfuly.record_posts_showing.status,
                posts: result
            }
            resolve(response)
        } catch (error) {
            resolve(failure.server_error)
            return
        }
    })
}
const showLikedPosts = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForLikedPost = `SELECT post_id FROM likes where user_id = ?`;
            const sqlForPostPhotos = `SELECT * FROM posts_image WHERE post_id = ?`;
            const sqlForUserId = `SELECT * FROM users WHERE username = ?`;
            const id = await dbhelper(sqlForUserId, req.query.username)
            const likedPosts = await dbhelper(sqlForLikedPost, id[0].id);
            let i;
            let result = [];
            if (likedPosts == "") { resolve(successfuly.there_is_nothing_to_show); return }
            for (i = 0; i < likedPosts.length; i++) {
                const postPhoto = await dbhelper(sqlForPostPhotos, likedPosts[i].post_id);
                result.push({
                    post_id: likedPosts[i].post_id,
                    post_images: [url + postPhoto[0].source]
                })
            }
            const response = {
                message: successfuly.record_posts_showing.message,
                code: successfuly.record_posts_showing.code,
                status: successfuly.record_posts_showing.status,
                posts: result
            }
            resolve(response)

        } catch (error) {
            resolve(failure.server_error);
        }
    })
}
const deletepost = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForPost = `SELECT user_id from posts WHERE id = ?`;
            const sqlForDeletePost = `DELETE FROM posts WHERE id = ?`;
            const sqlForDeletenotifications = `DELETE FROM notifications where body = ?`;
            const userid = await dbhelper(sqlForPost, req.body?.post_id);
            if (req.id != userid[0].user_id) { resolve(failure.server_error); return }
            const deletePost = await dbhelper(sqlForDeletePost, req.body?.post_id);
            if (deletePost.affectedRows == 0) { resolve(failure.post_not_found); return }
            await dbhelper(sqlForDeletenotifications, req.body?.post_id)
            resolve(successfuly.post_deleted)
        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
}
const addpostimage = async (req, res, id) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForPhoto = 'INSERT INTO posts_image SET ?';
            for (let i = 0; i < req?.files?.length; i++) {
                const photo = {
                    id: uuidv1(),
                    source: req.files[i].filename,
                    post_id: id
                }
                await dbhelper(sqlForPhoto, photo);
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
};
const addpostmaterial = async (req, res, id) => {
    return new Promise(async (resolve) => {
        try {
            const materials = req.body.materials;
            const materialArray = Array.isArray(materials) ? materials : [materials];
            const sqlForMaterial = 'INSERT INTO material SET ?';
            for (let i = 0; i < materialArray.length; i++) {
                const material = {
                    id: uuidv1(),
                    title: materialArray[i],
                    post_id: id
                }
                await dbhelper(sqlForMaterial, material);
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }

    })
};
const postedit = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForPostid = 'SELECT * FROM posts WHERE id = ?';
            const post_id = req.body.id;
            const sqlForUpdatePost = 'UPDATE posts SET title = ? , body = ? , status = ? where id = ?';
            const updateValues = [req.body.title, req.body.body, req.body.status, req.body.id];
            const result = await dbhelper(sqlForPostid, post_id);
            if (result == "") {
                resolve(failure.post_not_found);
                return
            } else {
                const updatepost = await dbhelper(sqlForUpdatePost, updateValues);
                if (updatepost == "") {
                    resolve(failure.post_not_update);
                    return
                } else {
                    resolve(successfuly.post_updated);
                    return
                }
            }
        } catch (error) {
            resolve(failure.server_error);
            return
        }

    })
}
module.exports = { addpost, postedit, deletepost, recordpost, showRecordedPosts, showLikedPosts};