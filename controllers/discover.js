const {dbhelper} = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const dotenv = require('dotenv');
dotenv.config();
const requestdiscovred = async(req,res)=>{
    return new Promise(async(resolve)=>{
        try {
            const url = process.env.IMAGEURL;
        const sql = `SELECT 
        p.id AS post_id,
        p.status AS status,
        p.title AS post_title,
        p.body AS post_body,
        p.created_at AS post_created_at,
        u.username AS user_name,
        u.photo AS user_photo
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id != ? AND p.status = true
    ORDER BY p.created_at DESC
    LIMIT 20 OFFSET ?  
    `;
        const sqlForPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
        const userid = req.id;
        let offset = req.query.offset*20;
        offset==null ? offset = 0:offset=parseInt(offset);
        const posts = await dbhelper(sql,[userid,offset]);
        if(posts==""){
            resolve(failure.there_is_nothing_to_show);
        }else{
            let postarray = [];
            let i;
            for(i=0;i<posts.length;i++){
                const photos = await dbhelper(sqlForPhoto,posts[i]?.post_id);
                const photosource = photos.map(({source})=>url+source)
                postarray.push({
                    post_id: posts[i]?.post_id,
                    post_title: posts[i]?.post_title,
                    post_body: posts[i]?.post_body,
                    post_created_at: posts[i]?.post_created_at,
                    post_images:photosource
                })
            }
            const message = {
                code:successfuly.discovred_showed.code,
                message:successfuly.discovred_showed.message,
                status:successfuly.discovred_showed.status,
                posts:postarray
            }
            resolve(message);
        }

        } catch (error) {
            resolve(failure.server_error);
            return
        }

    })
}
module.exports = requestdiscovred;