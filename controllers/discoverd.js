const {dbhelper} = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const requestdiscovred = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const sql = `SELECT 
        p.id AS post_id,
        p.title AS post_title,
        p.body AS post_body,
        p.created_at AS post_created_at,
        u.username AS user_name,
        u.photo AS user_photo
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id != ?
    ORDER BY p.created_at DESC
    LIMIT 20 OFFSET ?  
    `;
        const userid = req.id;
        let offset = req.query.offset*20;
        offset==null ? offset = 0:offset=parseInt(offset);
        console.log(offset)
        const posts = await dbhelper(sql,[userid,offset]);
        console.log(posts)
        if(posts==null){
            resolve(failure.there_is_nothing_to_show);
        }else if(posts.errno!=null){
            resolve(failure.server_error)
        }else{
            const message = {
                code:successfuly.discovred_showed.code,
                message:successfuly.discovred_showed.message,
                status:successfuly.discovred_showed.status,
                result:posts
            }
            resolve(message);
        }


    })
}
module.exports = requestdiscovred;