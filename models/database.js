const {createPool} = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const pool =  createPool({
    host:process.env.SERVER,
    user:process.env.NAME,
    password:process.env.PASSWORD,
    database:process.env.DBNAME,
    connectionLimit:20
})
const dbhelper = (sql,parametre) =>{
    return new Promise((resolve, reject)=>{
        pool.query(sql, parametre, (err, result, fields)=>{
            if(err){
                reject(new Error(err.message));
            }
                resolve(result);
        })
    })
       
}

module.exports = {pool, dbhelper};