const { v1: uuidv1 } = require('uuid');
const {dbhelper} = require('../models/database');
const{failure, successfuly} = require('../responses/responses');
const{uploadmulti} = require('../multer/multer');
const addpost = async(req,res)=>{
    return new Promise(async (resolve)=>{
        uploadmulti(req, res, async function (err) {
            if (err) {
                resolve(failure.server_error);
            } else {
                const post = {
                    id: uuidv1(),
                    title: req.body.title,
                    body:req.body.body,
                    user_id:req.id,
                    status:true
                }
                console.log(post);
                post.title==(undefined|""|null) ? resolve(failure.server_error):null;
                const sqlForpsot = `INSERT INTO posts SET ?`;
                const result = await dbhelper(sqlForpsot,post);
                if(result==null||result.fatal==true){
                    resolve(failure.server_error);
                }else{
                    addpostimage(req,res,post.id,(err)=>{
                        resolve(err);
                    });//post eklendikten sonra fotoğraf eklenmezse postu geri sil
                    addpostmaterial(req,res,post.id,(err)=>{
                        resolve(err);
                    })
                    resolve(successfuly.post_adedd);
                }
            }
        })
        
    })
}
const addpostimage = async(req,res,id) => {
    return new Promise(async(resolve)=>{
        const sqlForPhoto = 'INSERT INTO posts_image SET ?';
        for(let i = 0; i < req?.files?.length; i++){
            const photo ={
                id: uuidv1(),
                source:req.files[i].filename,
                post_id:id
            }
            await dbhelper(sqlForPhoto,photo);
        }
        
    })
};
const addpostmaterial = async(req,res,id) => {
    return new Promise(async(resolve)=>{
        const sqlForMaterial = 'INSERT INTO material SET ?';
        for(let i = 0; i < req.body?.materials?.length; i++){
            const material ={
                id: uuidv1(),
                title:req.body?.materials[i],
                // amount:req.body?.materials[i].amount,
                post_id:id
            }
            await dbhelper(sqlForMaterial,material);
        }
        
    })
};
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