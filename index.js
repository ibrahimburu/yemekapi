const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models/database');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const verifyRouter = require('./routes/verifyRouter');
const passwordRouter = require('./routes/passwordRouter');
const postRouter = require('./routes/postRouter');
const useroperationsRouter = require('./routes/useroperationsRouter');
const imageRouter = require('./routes/imageRouter');
const hompageRouter = require('./routes/hompageRouter');
const discoverRouter = require('./routes/discoverRouter');
const postdetailsRouter = require('./routes/postdetailsRouter');
const profileRouter = require('./routes/profileRouter');
const commentRouter = require('./routes/commentRouter');
const notificationsRouter = require('./routes/notificationsRouter');

const path = require('path');

dotenv.config();
//syfalama yapılacak

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) =>{
    res.json({message:"hello"})
})
app.use('/api/register',registerRouter);
app.use('/api/login',loginRouter);
app.use('/api/verify',verifyRouter);
app.use('/api/password',passwordRouter);
app.use('/api/post',postRouter);
app.use('/api/useroperations',useroperationsRouter);
app.use('/api/homepage',hompageRouter);
app.use('/api/discover',discoverRouter);
app.use('/api/images',imageRouter);
app.use('/api/getimage',imageRouter);
app.use('/api/postdetails',postdetailsRouter);
app.use('/api/comments',commentRouter);
app.use('/api/profile',profileRouter);
app.use('/api/notifications',notificationsRouter);



const PORT = process.env.PORT || 8088;

app.listen(PORT, ()=> {
    console.log(`server is running on port : ${PORT}`);
})