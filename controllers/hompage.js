const {dbhelper} = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const dotenv = require('dotenv');
dotenv.config();
const requesthompage = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const url = process.env.IMAGEURL;
        const sqlForPosts = `SELECT * FROM posts WHERE user_id in (SELECT user_id FROM followers where follower_id = ? AND status = true) AND status = true ORDER BY created_at DESC LIMIT 20 OFFSET ?`;
        const sqlForPhoto = `SELECT * FROM posts_image WHERE post_id = ?`;
        const sqlForMaterial = `SELECT * FROM material WHERE post_id = ?`;
        const sqlForLikeCount = `SELECT Count(*) as liked FROM likes where post_id = ?`;
        const sqlForLike = `SELECT * FROM likes where user_id = ? AND post_id = ?`;
        const sqlForCommentCount = `SELECT Count(*) as comment FROM comments where post_id = ?`;
        const sqlForUsers = `SELECT * FROM users where id = ?`;
        const followerid = req.id;
        let offset = req.query.offset;
        offset== undefined ? offset = 0:offset=parseInt(offset)*20;
        const request = [followerid,offset]
        try {
            const posts = await dbhelper(sqlForPosts,request);
        if(posts==null){
            resolve(failure.there_is_nothing_to_show);
            return
        }else{
            let already_liked = false;
            let i;
            result = [];
            for(i=0;i<posts.length;i++){
                const photo = await dbhelper(sqlForPhoto,posts[i]?.id);
                const photosource = photo.map(({source}) => url+source);
                const material = await dbhelper(sqlForMaterial,posts[i]?.id);
                const materialtitle = material.map(({title})=>title);
                const likecount = await dbhelper(sqlForLikeCount,posts[i]?.id);
                const commentCount = await dbhelper(sqlForCommentCount,posts[i]?.id);
                const user = await dbhelper(sqlForUsers,posts[i]?.user_id);
                const alreadyLiked = await dbhelper(sqlForLike,[req?.id,posts[i]?.id]);
                if(alreadyLiked!=""){
                    already_liked = true;
                }
                result.push({
                    post_id:posts[i]?.id,
                    post_title:posts[i]?.title,
                    post_body:posts[i]?.body,
                    post_created_at:posts[i]?.created_at,
                    post_images:photosource,
                    post_material:materialtitle,
                    like_count:likecount[0].liked,
                    comment_count:commentCount[0].comment,
                    user_name:user[0]?.username,
                    user_avatar:url + user[0]?.photo,
                    liked_by_user:already_liked
                })
            }
            
            const message = {
                code:successfuly.hompage_showed.code,
                message:successfuly.hompage_showed.message,
                status:successfuly.hompage_showed.status,
                posts:result
            }
            resolve(message);
        }
        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
            return
        }
        


    })
}
module.exports = requesthompage;