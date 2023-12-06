const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const dotenv = require('dotenv');
dotenv.config();
const profile = async(req,res)=>{
    return new Promise(async resolve=>{
        const url = process.env.IMAGEURL;
        const sqlForPosts = `SELECT * FROM posts WHERE user_id = ?`;
        const sqlForPhotos = `SELECT * FROM posts_image where post_id = ?`;
        const sqlForUser = `SELECT * FROM users WHERE username = ?`;
        const sqlForFollowersCount = `SELECT Count(*) as follower FROM followers WHERE user_id = ?`;
        const sqlForFollowCount = `SELECT Count(*) as follow FROM followers WHERE follower_id = ?`; 
        const user_name = req.params.username;
        try {
            const user = await dbhelper(sqlForUser,user_name);
        if(user==null){
            resolve(failure.user_not_found);
            return
        }else{
            const id = user[0]?.id;
            const posts = await dbhelper(sqlForPosts,id);
            const postCount = posts.length;
            if(posts==null){
                resolve(failure.server_error)
                return
            }else{
                const followersCount = await dbhelper(sqlForFollowersCount,user[0]?.id);
                const followCount = await dbhelper(sqlForFollowCount,user[0]?.id)
                let i;
                let j;
                let result = [];
                for(i=0;i<posts.length;i++){
                    const photo = await dbhelper(sqlForPhotos,posts[i]?.id);
                    const photosource = photo.map(({source}) => source);
                    let urll =[];
                for(j=0;j<photosource.length;j++){
                     urll[j] = `${url}${photosource[j]}`
                }
                    result.push({
                        post_id:posts[i]?.id,
                        post_title:posts[i]?.title,
                        post_photo:urll,
                    })

                }                
                const message = {
                    code:successfuly.post_showed.code,
                    message:successfuly.post_showed.message,
                    status:successfuly.post_showed.status,
                    followers:followersCount[0]?.follower,
                    follow:followCount[0]?.follow,
                    post_count:postCount,
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
module.exports = { profile};