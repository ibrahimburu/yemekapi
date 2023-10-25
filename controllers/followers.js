const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const { v1: uuidv1 } = require('uuid');
const notifications = require('../controllers/notifications');
const follow = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'INSERT INTO  follewers SET ?';
         const newfollower = {
            id:req.body.followerid,
            follower_id:req.id,
            status:false
         };
         const followed = await dbhelper(sql,newfollower);
        if(followed==null||followed.fatal==true){
            resolve(failure.server_error)          
        }else{resolve(successfuly.post_adedd);}//şimdilikböyle dursun
    })
    };
const followerrequest = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'SELECT * FROM followers WHERE id = ? AND status = ?';
         const followrequset = [req.id,false];
         const request = await dbhelper(sql,followrequset);
         if(request==null||request.fatal==true){//diğer bütün if elsler böyle olmalı
            if(request==null){
                resolve(failure.no_result);
            }else{resolve(failure.server_error)}           
        }else{resolve(request);}
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
        }else{resolve(result);}
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
module.exports = {follow, search, followerrequest, liked, addcoment};