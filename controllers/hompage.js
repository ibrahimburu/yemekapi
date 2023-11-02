const {dbhelper} = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const requesthompage = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const sql = `SELECT
        p.id AS post_id,
        p.title AS post_title,
        p.body AS post_body,
        u.username AS post_owner,
        u.photo AS post_owner_photo,
        COUNT(DISTINCT l.id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        EXISTS (
            SELECT 1
            FROM likes AS ul
            WHERE ul.user_id = ? AND ul.post_id = p.id
        ) AS liked_by_user
    FROM
        posts AS p
    INNER JOIN
        users AS u ON p.user_id = u.id
    LEFT JOIN
        likes AS l ON p.id = l.post_id
    LEFT JOIN
        comments AS c ON p.id = c.post_id
    GROUP BY
        p.id, p.title, p.body, u.username, u.photo
    ORDER BY
        p.created_at DESC`;
        const followerid = req.id;
        const followed = await dbhelper(sql,followerid);
        console.log(followed);
        if(followed==null){
            resolve(failure.there_is_nothing_to_show);
        }else if(followed.errno!=null){
            resolve(failure.server_error)
        }else{
            const message = {
                code:successfuly.hompage_showed.code,
                message:successfuly.hompage_showed.message,
                status:successfuly.hompage_showed.status,
                result:followed
            }
            resolve(message);
        }


    })
}
module.exports = requesthompage;