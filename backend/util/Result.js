const ResultCode = require("./ResultCode")

class Result {
    code;
    msg;
    data;

    constructor(code, msg, data) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    static success(data) {
        return new Result(ResultCode.SUCCESS.code, ResultCode.SUCCESS.desc, data)
    }

    static failUpdate() {
        return new Result(ResultCode.UPDATE_FAIL, ResultCode.UPDATE_FAIL.desc, null)
    }

    static fail(msg) {
        if (msg === undefined || msg === null)
            msg = ResultCode.FAIL.desc
        return new Result(ResultCode.FAIL.code, msg, null)
    }

    static invalidUserId(){
        return new Result(ResultCode.INVALID_USERID.code, ResultCode.INVALID_USERID.desc, null)
    }
}

module.exports = Result