class ResultCode{
    code;
    desc;

    constructor(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    static SUCCESS = new ResultCode(20000, 'success');
    static UPDATE_FAIL = new ResultCode(40001, 'Fail to update information in database')
    static INVALID_USERID = new ResultCode(40002, 'The given user_id is invalid')
    static INVALID_POSTID = new ResultCode(40003, 'The given post_id is invalid')
    static FAIL_SIGNUP = new ResultCode(40004, 'Fail to sign up')
    static INVALID_EMAIL = new ResultCode(40005, 'The given email is invalid')
    static INVALID_PASSWORD = new ResultCode(40006, 'The given password is invalid')
    static INVALID_AUDIENCE_ID = new ResultCode(40007, 'The given audience id is invalid')
    static INVALID_CREATOR_ID = new ResultCode(40008, 'The given creator id is invalid')
    static ALREADY_SUBSCRIBE = new ResultCode(40009, 'The user has already subscribe the creator')
    static NOT_SUBSCRIBE = new ResultCode(40010, 'The user hasn\'t subscribe this creator')
    static ID_CONFLICT = new ResultCode(40011, 'Input ids are duplicate')
    static FAIL_NOTIFICATION = new ResultCode(40012, 'Fail to send notifications to subscribers')
    static FAIL = new ResultCode(40000, 'fail');
}

module.exports = ResultCode