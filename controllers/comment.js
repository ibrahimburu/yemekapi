const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const { v1: uuidv1 } = require('uuid');
const notifications = require('../controllers/notifications');
const addcomment = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
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
            if (postavailable == "") {
                resolve(failure.post_not_found)
                return
            } else {
                const comment = await dbhelper(sql, newcomment);
                if (comment == "") {
                    resolve(failure.server_error);
                    return
                } else {
                    resolve(successfuly.comment_added);
                    const notification = {
                        target: postavailable[0]?.user_id,
                        source: req.id,
                        type: "comment",//bu ayarlanacak
                    }
                    notifications(notification);
                    return
                }
            }
        } catch (error) {
            resolve(failure.server_error)
            return
        }
    })
};
const showcomment = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqlForComment = `SELECT id,user_id,body,created_at FROM comments where post_id = ?`;
            const sqlForUser = `SELECT username,photo FROM users where id = ?`;
            const sqlForCommentLikeCount = `SELECT Count(*) as comment_like_count FROM comment_like WHERE comment_id = ?`;
            const sqlForCommentLiked = `SELECT * FROM comment_like WHERE comment_id = ? AND user_id= ?`;
            const post_id = req.params.id;
            const comments = await dbhelper(sqlForComment, post_id);
            if (comments == "") {
                resolve(failure.there_is_nothing_to_show);
            } else {
                let i;
                let data = [];
                let likestatus = false;
                for (i = 0; i < comments.length; i++) {
                    const user = await dbhelper(sqlForUser, comments[i].user_id);
                    const likeCount = await dbhelper(sqlForCommentLikeCount, comments[i].id);
                    const isLiked = await dbhelper(sqlForCommentLiked, [comments[i].id, user[0].id]);
                    if(isLiked != ""){likestatus = true}
                    data.push({
                         comment_id: comments[i].id,
                         comment_body: comments[i].body,
                         user_name: user[0].username,
                         user_avatar: user[0].photo,
                         comment_like_count:likeCount[0].comment_like_count,
                         liked_by_user:likestatus,
                         created_at:comments[i].created_at
                    })
                }
                // const user =await Promise.all(comments.map(async (comment) => {
                //     const userData = await dbhelper(sqlForUser, comment.user_id);
                //     return { ...comment, ...userData[0] };
                // }));
                // const data = await Promise.all(user.map(async(comment) => {
                //     const count = await dbhelper(sqlForCommentLikeCount,comment.id);
                //     const cData = {...comment, ...count[0]};
                //     delete cData.user_id 
                //     return cData
                // }))

                // const isLiked = await Promise.all(data.map((user) => {})) await dbhelper(sqlForCommentLiked);
                result = {
                    message: successfuly.comment_added.message,
                    code: successfuly.comment_added.code,
                    status: successfuly.comment_added.status,
                    comments: data
                }
                resolve(result)
            }
        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
            return
        }
    })
}
const addcommentlike = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const sqForLike = `SELECT * FROM comment_like WHERE user_id = ? AND comment_id = ?`;
            const sqForDeleteLike = `DELETE FROM comment_like WHERE user_id = ? AND comment_id = ?`;
            const sqlForCommentLike = `INSERT INTO comment_like SET ?`;
            const already_liked = await dbhelper(sqForLike, [req.id, req.body?.comment_id]);
            if (already_liked != "") {
                console.log(await dbhelper(sqForDeleteLike, [req.id, req.body?.comment_id]))
                resolve(successfuly.unliked);
                return
            } else {
                const newcomment_like = {
                    id: uuidv1(),
                    user_id: req.id,
                    comment_id: req?.body?.comment_id
                }
                const like = await dbhelper(sqlForCommentLike, newcomment_like);
                if (like == "") {
                    resolve(failure.server_error);
                    return
                } else {
                    resolve(successfuly.like_added);
                    return
                }
            }

        } catch (error) {
            resolve(failure.server_error);
            return
        }
    })
}

module.exports = { addcomment, addcommentlike, showcomment };