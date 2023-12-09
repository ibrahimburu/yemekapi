const { v1: uuidv1 } = require('uuid');
const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { uploadmulti } = require('../multer/multer');
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
                    const result = await dbhelper(sqlForpsot, post).then().catch(error=>{resolve(failure.server_error);return});
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
            const sqlForMaterial = 'INSERT INTO material SET ?';
            for (let i = 0; i < req.body?.materials?.length; i++) {
                const material = {
                    id: uuidv1(),
                    title: req.body?.materials[i],
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
module.exports = { addpost, postedit };