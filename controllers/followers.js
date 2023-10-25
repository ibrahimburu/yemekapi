const {dbhelper} = require('../models/database');
const {failure, successfuly} = require('../responses/responses');
const { v1: uuidv1 } = require('uuid');
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
        const sqlForUsreName = 'SELECT *FROM users WHERE useername LIKE ?';
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
            post_id:req.postid,
         };
         const like = await dbhelper(sql,newlike);
        if(like==null||like.fatal==true){
            resolve(failure.server_error)          
        }else{
            const findpostowner = dbhelper(sqlForPostid,postid);
            if(findpostowner.fatal==true){
                resolve(failure.server_error);
            }else if(findpostowner==null){
                resolve(failure.post_not_found);
            }else{
                resolve(successfuly.like_added);
                const notification = {
                    target:findpostowner.user_id,
                    source:req.id,
                    type:like,//bu ayarlanacak
                }
            }
        }//şimdilikböyle dursun
    })
    };
const addcoment = async(req,res)=>{
    return new Promise(async(resolve)=>{
         const sql = 'INSERT INTO  comments SET ?';
         const newcomment = {
            id:uuidv1(),
            user_id:req.id,
            post_id:req.body.post_id,
            body:req.body.body
         };
         const comment = await dbhelper(sql,newcomment);
        if(comment==null||comment.fatal==true){
            resolve(failure.server_error)          
        }else{resolve(successfuly.like_added);
            const notification = {
                target:findpostowner.user_id,
                source:req.id,
                type:like,//bu ayarlanacak
            }}//şimdilikböyle dursun
    })
    };
module.exports = {follow, search, followerrequest, liked, addcoment};