const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"images")
    },
    filename:function(req,file,cb){
        const uniqname=uuidv1()+".jpg";
        cb(null,uniqname);
    }
})
const upload = multer({storage:storage}).single('file');
const uploadmulti = multer({storage:storage}).array('files',3);
module.exports = {upload,uploadmulti};