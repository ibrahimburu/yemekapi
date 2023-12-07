const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const dotenv = require('dotenv');
dotenv.config();
const postdetails = async(req,res)=>{
    return new Promise(async resolve=>{
        const url = process.env.IMAGEURL;
        const sql = `SELECT * FROM posts WHERE id = ?`;
        const sqlForPhotos = `SELECT * FROM posts_image where post_id = ?`;
        const sqlForUser = `SELECT * FROM users WHERE id = ?`;
        const sqlForMetarials = `SELECT * FROM material WHERE post_id = ?`;
        const sqlForLikeCount = `SELECT Count(*) as liked FROM likes where post_id = ?`;
        const sqlForLike = `SELECT * FROM likes where user_id = ? AND post_id = ?`;
        const sqlForCommentCount = `SELECT Count(*) as comment FROM comments where post_id = ?`;
        const post_id = req.params.id;
        try {
            const post = await dbhelper(sql,post_id);
        if(post==null){
            resolve(failure.there_is_nothing_to_show);
            return
        }else{
            const id = post[0]?.user_id;
            const user = await dbhelper(sqlForUser,id);
            if(user==""){
                resolve(failure.server_error)
                return
            }else{
                let already_liked = false;
                const postid = post[0]?.id;
                const photo = await dbhelper(sqlForPhotos,postid);
                const materials = await dbhelper(sqlForMetarials,postid);
                const photosource = photo.map(({source}) => url+source);
                const material = materials.map(materials => materials.title);
                const likecount = await dbhelper(sqlForLikeCount,postid);
                const commentCount = await dbhelper(sqlForCommentCount,postid)
                const alreadyLiked = await dbhelper(sqlForLike,[req?.id,post[0]?.id]);
                if(alreadyLiked!=""){
                    already_liked = true;
                }
                const result = {
                    post_id:post[0]?.id,
                    post_title:post[0]?.title,
                    post_body:post[0]?.body,
                    post_images:photosource,
                    post_materials:material,
                    post_created_at:post[0]?.created_at,
                    user_name:user[0]?.username,
                    user_avatar:user[0]?.photo,
                    like_count:likecount[0].liked,
                    comment_count:commentCount[0].comment,
                    liked_by_user:already_liked
                }
                const message = {
                    code:successfuly.post_showed.code,
                    message:successfuly.post_showed.message,
                    status:successfuly.post_showed.status,
                    post:result
                }
                resolve(message);
            }
        }
            
        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
            return
        }
        
    })
}
const postcomments = async(req,res)=>{
    return new Promise(async resolve=>{
        const sql = `SELECT * FROM comments WHERE post_id = ?`;
        const sqlForUser = `SELECT * FROM users WHERE id = ?`;
        const post_id = req.params.id;
        try {
            const comments = await dbhelper(sql,post_id);
        if(comments==null){
            resolve(failure.there_is_nothing_to_show);
            return
        }else{
            let i;
            for(i=0;i<comments.length;i++){
                const id = comments[i]?.user_id;
            const user = await dbhelper(sqlForUser,id);
                if(user==null){
                    resolve(failure.server_error)
                    return
                }else{
                    let result=[];
                    result.push(
                        {id:comments[i]?.id,
                            comment_body:comments[i]?.body,
                            user_name:user[0]?.username,
                            user_avatar:user[0]?.photo}
                        )
                     
                }
            }    
        }
        const message = {
            code:successfuly.hompage_showed.code,
            message:successfuly.hompage_showed.message,
            status:successfuly.hompage_showed.status,
            comments:result
        }
            resolve(message);    
        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
            return
        }
        
    })
}

module.exports = { postdetails, postcomments}