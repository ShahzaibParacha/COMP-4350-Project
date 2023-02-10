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
    static FAIL = new ResultCode(40000, 'fail');
}

module.exports = ResultCode