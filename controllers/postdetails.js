const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const postdetails = async(req,res)=>{
    return new Promise(async resolve=>{
        const sql = `SELECT * FROM posts WHERE id = ?`;
        const sqlForPhotos = `SELECT * FROM posts_image where post_id = ?`;
        const sqlForUser = `SELECT * FROM users WHERE id = ?`;
        const sqlForMetarials = `SELECT * FROM material WHERE post_id = ?`;
        const post_id = req.params.id;
        try {
            const post = await dbhelper(sql,post_id);
        if(post==null){
            resolve(failure.there_is_nothing_to_show);
            return
        }else{
            const id = post[0]?.user_id;
            const user = await dbhelper(sqlForUser,id);
            if(user==null){
                resolve(failure.server_error)
                return
            }else{
                const postid = post[0]?.id;
                const photo = await dbhelper(sqlForPhotos,postid);
                const materials = await dbhelper(sqlForMetarials,postid);
                const photosource = photo.map(({source}) => source);
                const material = materials.map(materials => materials.title);
                const result = {
                    post_id:post[0]?.id,
                    post_title:post[0]?.title,
                    post_body:post[0]?.body,
                    post_photos:photosource,
                    post_materials:material,
                    user_name:user[0]?.username,
                    user_avatar:user[0]?.photo
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