const {createPool} = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const pool =  createPool({
    host:process.env.SERVER,
    user:process.env.NAME,
    password:process.env.PASSWORD,
    database:process.env.NAME,
    connectionLimit:20
})
const dbhelper = (sql,parametre) =>{
    return new Promise(resolve=>{
        pool.query(sql, parametre, (err, result, fields)=>{
            if(err){
                resolve(err);
            }
                resolve(result);
        })
    })
       
}

module.exports = {pool, dbhelper};