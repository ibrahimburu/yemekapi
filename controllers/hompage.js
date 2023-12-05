const {dbhelper} = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const requesthompage = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const sql = `SELECT
        p.id AS post_id,
        p.title AS post_title,
        p.body AS post_body,
        m.title AS material_title,
        m.amount AS material_amount,
        GROUP_CONCAT(pi.source) AS post_images,
        IFNULL(SUM(lc.like_count), 0) AS like_count,
        IFNULL(SUM(cc.comment_count), 0) AS comment_count,
        u.username AS user_name,
        u.photo AS user_avatar
    FROM
        posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN material m ON m.post_id = p.id
        LEFT JOIN posts_image pi ON pi.post_id = p.id
        LEFT JOIN (
            SELECT post_id, COUNT(id) AS like_count
            FROM likes
            GROUP BY post_id
        ) AS lc ON lc.post_id = p.id
        LEFT JOIN (
            SELECT post_id, COUNT(id) AS comment_count
            FROM comments
            GROUP BY post_id
        ) AS cc ON cc.post_id = p.id
    WHERE
        p.user_id IN (
            SELECT user_id
            FROM followers
            WHERE follower_id = ?
        )
        AND p.status = 1
    GROUP BY
        p.id, p.title, p.body, m.title, m.amount, u.username, u.photo
    ORDER BY
        p.created_at DESC
    LIMIT 20 OFFSET ?
    `;
        const followerid = req.id;
        let offset = req.query.offset;
        offset== undefined ? offset = 0:offset=parseInt(offset)*20;
        const followed = await dbhelper(sql,[followerid,offset]);
        if(followed==null){
            resolve(failure.there_is_nothing_to_show);
        }else if(followed.errno!=null){
            resolve(failure.server_error)
        }else{
            const message = {
                code:successfuly.hompage_showed.code,
                message:successfuly.hompage_showed.message,
                status:successfuly.hompage_showed.status,
                posts:followed
            }
            resolve(message);
        }


    })
}
module.exports = requesthompage;