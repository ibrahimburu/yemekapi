const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const { v1: uuidv1 } = require('uuid');
const notifications = require('../controllers/notifications');
const upload = require('../multer/multer');
const follow = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'INSERT INTO  followers SET ?';
         const sqlForUsername = 'SELECT * FROM users where username = ? ';
         const username = req.body.username;
         const result = await dbhelper(sqlForUsername,username);
         if(result==null){
            resolve(failure.server_error);
         }else if(result.fatal==true){
            resolve(failure.user_not_found);
         }else{
            const newfollower = {
                user_id:result[0]?.id,
                follower_id:req.id,
                status:false
             };
             const followed = await dbhelper(sql,newfollower);
            if(followed==null||followed.fatal==true){
                resolve(failure.server_error)          
            }else{resolve(successfuly.follow_request_sended);}
         }
         
    })
    };
const followerrequest = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'SELECT * FROM followers WHERE user_id = ? AND status = ?';
         const followrequset = [req.id,false];
         const request = await dbhelper(sql,followrequset);
         console.log(req.id)
         if(request==null||request.fatal==true){//diğer bütün if elsler böyle olmalı
            if(request==null){
                resolve(failure.no_result);
            }else{resolve(failure.server_error)}           
        }else{
            const response = {
                message:successfuly.comment_added.message,
                code:successfuly.comment_added.code,
                status:successfuly.comment_added.status,
                users:request
            }
            resolve(response);}
    })
    }; 
 const search = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const sqlForUsreName = 'SELECT *FROM users WHERE username LIKE ?';
        const name = `${req.body.username}%`;
        const result = await dbhelper(sqlForUsreName,name);
        if(result==null||result.fatal==true){//diğer bütün if elsler böyle olmalı
            if(result==null){
                resolve(failure.user_not_found);
            }else{resolve(failure.server_error)}           
        }else{
            const response = {
                message:successfuly.comment_added.message,
                code:successfuly.comment_added.code,
                status:successfuly.comment_added.status,
                users:result
            }
            resolve(response);}
     })
    };
const liked = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'INSERT INTO  likes SET ?';
         const sqlForPostid = 'SELECT * FROM posts where id = ?';
         const postid = req.body.post_id;
         const newlike = {
            id:uuidv1(),
            user_id:req.id,
            post_id:postid,
         };
        const postavailable = await dbhelper(sqlForPostid,postid);
        if(postavailable==null||postavailable.fatal==true){
            resolve(failure.post_not_found);
        }else{
            const like = await dbhelper(sql,newlike);
            if(like==null||like.fatal==true){
                resolve(failure.server_error);
            }else{
                resolve(successfuly.like_added);
                const notification = {
                    target:postavailable[0]?.user_id,
                    source:req.id,
                    type:like,//bu ayarlanacak
                }
                notifications(notification);
            }
        }
    })
    };
const addcoment = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'INSERT INTO  comments SET ?';
         const sqlForPostid = 'SELECT * FROM posts where id = ?';
         const postid = req.body.post_id;
         const newcomment = {
            id:uuidv1(),
            user_id:req.id,
            post_id:req.body.post_id,
            body:req.body.body
         };
         const postavailable = await dbhelper(sqlForPostid,postid);
         if(postavailable==null||postavailable.fatal==true){
            resolve(failure.post_not_found);
        }else{
            const comment = await dbhelper(sql,newcomment);
            if(comment==null||comment.fatal==true){
                resolve(failure.server_error);
            }else{
                resolve(successfuly.comment_added);
                const notification = {
                    target:postavailable[0]?.user_id,
                    source:req.id,
                    type:comment,//bu ayarlanacak
                }
                notifications(notification);
            }
        }
    })
    };
const addavatar = async(req,res) => {
    return new Promise(async(resolve)=>{
        upload(req, res, async function (err) {
            if (err) {
                resolve(failure.avatar_not_added);
            } else {
                const sqlForUpdate = 'UPDATE users SET photo = ? where id = ?';
                console.log(req.file.filename)
                const image = req.file.filename;
                const addimage = await dbhelper(sqlForUpdate, image);
                if (addimage == null || addimage.fatal == true) {
                    resolve(failure.server_error);
                } else {
                    resolve(successfuly.avatar_added);
                }
            }
        })
    })
}
module.exports = {follow, search, followerrequest, liked, addcoment, addavatar};