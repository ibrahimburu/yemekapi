const failure = {
    already_exist:{
        "code":400,
        "message":"users_already_exists",
        "status":false
    },
    user_name_already_exist:{
        "code":400,
        "message":"users_name_already_exists",
        "status":false
    },
    password_must_be_greater_than_eight_characters:{
        "code":400,
        "message":"password_must_be_greater_than_eight_characters",
        "status":false
    },
    user_name_is_not_exist:{
        "code":400,
        "message":"users_name_is_not_exists",
        "status":false
    },
    account_is_not_verified:{
        "code":400,
        "message":"account_is_not_verified",
        "status":false
    },
    wrong_password:{
        "code":400,
        "message":"wrong_password",
        "status":false
    },
    must_be_login:{
        "code":400,
        "message":"must_be_login",
        "status":false
    },
    token_wrong:{
        "code":400,
        "message":"token_wrong",
        "status":false
    },
    account_not_found:{
        "code":400,
        "message":"account_not_found",
        "status":false
    },
    user_name_to_short:{
        "code":400,
        "message":"user_name_to_short",
        "status":false
    },
    account_already_verified:{
        "code":400,
        "message":"account_already_verified",
        "status":false
    },
    you_must_be_login:{
        "code":400,
        "message":"you_must_be_login",
        "status":false
    },
    wrong_token:{
        "code":400,
        "message":"wrong_token",
        "status":false
    },
    email_not_send:{
        "code":400,
        "message":"email_not_send",
        "status":false
    },
    you_must_write_different_username:{
        "code":400,
        "message":"you_must_write_different_username",
        "status":false
    },
        server_error:{
        "code":400,
        "message":"server_error",
        "status":false
    },
    Your_new_password_cannot_be_the_same_as_your_old_password:{
        "code":400,
        "message":"Your_new_password_cannot_be_the_same_as_your_old_password",
        "status":false
    },
    post_not_found:{
        "code":400,
        "message":"post_not_found",
        "status":false
    },
    post_not_update:{
        "code":400,
        "message":"update",
        "status":false
    },
    user_not_found:{
        "code":400,
        "message":"user_not_found",
        "status":false
    },
    no_result:{
        "code":400,
        "message":"no_result",
        "status":false
    },
    avatar_not_added:{
        "code":400,
        "message":"avatar_not_added",
        "status":false
    },
    there_is_nothing_to_show:{
        "code":400,
        "message":"there_is_nothing_to_show",
        "status":false
    }
    
        
}
const successfuly = {
    register_added_and_email_sended:{
        "code":200,
        "message":"register_added_and_email_sended",
        "status":true
    },
    register_added_but_email_not_send:{
        "code":200,
        "message":"register_added_but_email_not_send",
        "status":true
    },
    login_successfuly:{
        "code":200,
        "message":"login_successfuly",
        "status":true
    },
    account_verified:{
        "code":200,
        "message":"account_verified",
        "status":true
    },
    sent_again:{
        "code":200,
        "message":"sent_again",
        "status":true
    },
    email_sended:{
        "code":200,
        "message":"email_sended",
        "status":true
    },
    email_sended:{
        "code":200,
        "message":"email_sended",
        "status":true
    },
    password_changed:{
        "code":200,
        "message":"password_changed",
        "status":true
    },
    post_adedd:{
        "code":200,
        "message":"post_adedd",
        "status":true
    },
    post_updated:{
        "code":200,
        "message":"post_updated",
        "status":true
    },
    like_added:{
        "code":200,
        "message":"like_added",
        "status":true
    },
    comment_added:{
        "code":200,
        "message":"comment_added",
        "status":true
    },
    follow_request_sended:{
        "code":200,
        "message":"follow_request_sended",
        "status":true
    },
    follow_request_accepted:{
        "code":200,
        "message":"follow_request_accepted",
        "status":true
    },
    follow_request_deleted:{
        "code":200,
        "message":"follow_request_deleted",
        "status":true
    },
    follow_request_showed:{
        "code":200,
        "message":"follow_request_showed",
        "status":true
    },
    avatar_added:{
        "code":200,
        "message":"avatar_added",
        "status":true
    },
    avatar_added:{
        "code":200,
        "message":"avatar_added",
        "status":true
    },
    hompage_showed:{
        "code":200,
        "message":"hompage_showed",
        "status":true
    }
}

module.exports = {failure,successfuly};

