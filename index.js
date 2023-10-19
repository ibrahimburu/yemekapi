const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models/database');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const verifyRouter = require('./routes/verifyRouter');

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) =>{
    res.json({message:"hesllo"})
})
app.use('/api/register',registerRouter);
app.use('/api/login',loginRouter);
app.use('/api/verify',verifyRouter);

const PORT = process.env.PORT || 8088;

app.listen(PORT, ()=> {
    console.log(`server is running on port : ${PORT}`);
})