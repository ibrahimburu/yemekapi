const { dbhelper } = require('../models/database');
const { failure, successfuly } = require('../responses/responses');
const dotenv = require('dotenv');
dotenv.config();
const myProfile = async (req, res) => {
    return new Promise(async resolve => {
        const url = process.env.IMAGEURL;
        const sqlForPosts = `SELECT * FROM posts WHERE user_id = ? AND status = true ORDER BY created_at DESC`;
        const sqlForPhotos = `SELECT * FROM posts_image where post_id = ?`;
        const sqlForUser = `SELECT * FROM users WHERE username = ?`;
        const sqlForFollowersCount = `SELECT Count(*) as follower FROM followers WHERE user_id = ?`;
        const sqlForFollowCount = `SELECT Count(*) as follow FROM followers WHERE follower_id = ?`;
        const sqlForUsername = `SELECT username as name FROM users WHERE id = ?`;
        const user_name = req.params.username.trim().toLocaleLowerCase('tr-TR');
        try {
            const my = await dbhelper(sqlForUsername, req.id);
            if (user_name == my[0]?.name) {
                const user = await dbhelper(sqlForUser, user_name);
                if (user == null) {
                    resolve(failure.user_not_found);
                    return
                } else {
                    const id = user[0]?.id;
                    const posts = await dbhelper(sqlForPosts, id);
                    const postCount = posts.length;
                    if (posts == null) {
                        resolve(failure.server_error)
                        return
                    } else {
                        const followersCount = await dbhelper(sqlForFollowersCount, user[0]?.id);
                        const followCount = await dbhelper(sqlForFollowCount, user[0]?.id)
                        let i;
                        let j;
                        let result = [];
                        for (i = 0; i < posts.length; i++) {
                            const photo = await dbhelper(sqlForPhotos, posts[i]?.id);
                            const photosource = photo.map(({ source }) => source);
                            let urll = [];
                            for (j = 0; j < photosource.length; j++) {
                                urll[j] = `${url}${photosource[j]}`
                            }
                            result.push({
                                post_id: posts[i]?.id,
                                post_title: posts[i]?.title,
                                post_images: urll,
                            })

                        }
                        const message = {
                            code: successfuly.post_showed.code,
                            message: successfuly.post_showed.message,
                            status: successfuly.post_showed.status,
                            user_name: user[0]?.username,
                            user_bio: user[0]?.bio,
                            user_avatar: user[0]?.photo,
                            followers: followersCount[0]?.follower,
                            follow: followCount[0]?.follow,
                            post_count: postCount,
                            posts: result
                        }
                        resolve(message);
                    }
                }
            } else {
                const sqlForFollowStatus = `SELECT * FROM followers where follower_id = ? AND user_id = ?`;
                const user = await dbhelper(sqlForUser, user_name);
                if (user == "") {
                    resolve(failure.user_not_found);
                    return
                } else {
                    const id = user[0]?.id;
                    const posts = await dbhelper(sqlForPosts, id);
                    const postCount = posts.length;
                    const followersCount = await dbhelper(sqlForFollowersCount, user[0]?.id);
                    const followCount = await dbhelper(sqlForFollowCount, user[0]?.id)
                    let i;
                    let j;
                    let result = [];
                    for (i = 0; i < posts.length; i++) {
                        const photo = await dbhelper(sqlForPhotos, posts[i]?.id);
                        const photosource = photo.map(({ source }) => source);
                        let urll = [];
                        for (j = 0; j < photosource.length; j++) {
                            urll[j] = `${url}${photosource[j]}`
                        }
                        result.push({
                            post_id: posts[i]?.id,
                            post_title: posts[i]?.title,
                            post_images: urll,
                        })

                    }
                    const followstatus = await dbhelper(sqlForFollowStatus, [req.id, user[0]?.id]);
                    const message = {
                        code: successfuly.post_showed.code,
                        message: successfuly.post_showed.message,
                        status: successfuly.post_showed.status,
                        user_name: user[0]?.username,
                        user_bio: user[0]?.bio,
                        user_avatar: user[0]?.photo,
                        followers: followersCount[0]?.follower,
                        follow: followCount[0]?.follow,
                        post_count: postCount,
                        followpanding: false,
                        followstatus: false,
                        posts: result
                    }
                    if (followstatus == "") {
                        // const message = {
                        //     code: successfuly.post_showed.code,
                        //     message: successfuly.post_showed.message,
                        //     status: successfuly.post_showed.status,
                        //     user_name: user[0]?.username,
                        //     user_bio: user[0]?.bio,
                        //     user_avatar: user[0]?.photo,
                        //     followers: followersCount[0]?.follower,
                        //     follow: followCount[0]?.follow,
                        //     post_count: postCount,
                        //     followpanding: false,
                        //     followstatus: false,
                        //     posts: result
                        // }
                        resolve(message)
                    } else if (followstatus[0]?.status == true) {
                        // const message = {
                        //     code: successfuly.post_showed.code,
                        //     message: successfuly.post_showed.message,
                        //     status: successfuly.post_showed.status,
                        //     user_name: user[0]?.username,
                        //     user_bio: user[0]?.bio,
                        //     user_avatar: user[0]?.photo,
                        //     followers: followersCount[0]?.follower,
                        //     follow: followCount[0]?.follow,
                        //     post_count: postCount,
                        //     followstatus: true,
                        //     followpanding: false,
                        //     posts: result
                        // }
                        message.followstatus =true;
                        resolve(message);
                    } else {
                        // const message = {
                        //     code: successfuly.post_showed.code,
                        //     message: successfuly.post_showed.message,
                        //     status: successfuly.post_showed.status,
                        //     user_name: user[0]?.username,
                        //     user_bio: user[0]?.bio,
                        //     user_avatar: user[0]?.photo,
                        //     followers: followersCount[0]?.follower,
                        //     follow: followCount[0]?.follow,
                        //     post_count: postCount,
                        //     followstatus: true,
                        //     followpanding: true,
                        //     posts: result
                        // }
                        message.followstatus=true;
                        message.followpanding=true;
                        resolve(message);
                    }
                }
            }


        } catch (error) {
            console.log(error)
            resolve(failure.server_error);
            return
        }

    })
}
module.exports = { myProfile };