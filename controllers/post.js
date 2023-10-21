const { v1: uuidv1 } = require('uuid');
const {dbhelper} = require('../models/database');
const{failure, successfuly} = require('../responses/responses');
const addpost = async(req,res)=>{
    return new Promise(async (resolve)=>{
        const post = {
            id: uuidv1(),
            title: req.body.title,
            body:req.body.body,
            user_id:req.id,
            status:true
        }
        const sqlForpsot = `INSERT INTO posts SET ?`;
        const result = await dbhelper(sqlForpsot,post);
        if(result==null||result.fatal==true){
            resolve(failure.server_error);
        }else{
            resolve(successfuly.post_adedd);
        }
    })
}
const postedit = async(req,res)=>{
    return new Promise(async(resolve)=>{
        const sqlForPostid = 'SELECT * FROM posts WHERE id = ?';
        const post_id = req.body.id;
        const sqlForUpdatePost = 'UPDATE posts SET title = ? , body = ? , status = ? where id = ?';
        const updateValues = [req.body.title, req.body.body, req.body.status, req.body.id];
        const result = await dbhelper(sqlForPostid,post_id);
        if(result==null||result.fatal==true){//diğer bütün if elsler böyle olmalı
            if(result==null){
                resolve(failure.post_not_found);
            }else{resolve(failure.server_error)}
        }else{
            const updatepost = await dbhelper(sqlForUpdatePost,updateValues);
            if(updatepost==null||updatepost.fatal==true){//diğer bütün if elsler böyle olmalı
            if(updatepost==null){
                resolve(failure.post_not_update);
            }else{resolve(failure.server_error)}
        }else{
            resolve(successfuly.post_updated);
        }            
        }
    })
}
module.exports = {addpost, postedit};