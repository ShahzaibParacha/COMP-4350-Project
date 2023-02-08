const ResultCode = require("./ResultCode")
const {mode} = require("mongoose/webpack.base.config");

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

    static fail(msg) {
        if (msg === undefined || msg === null)
            msg = ResultCode.FAIL.desc
        return new Result(ResultCode.FAIL.code, msg, null)
    }
}

module.exports = Result