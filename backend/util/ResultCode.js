class ResultCode{
    code;
    desc;

    constructor(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    static SUCCESS = new ResultCode(20000, 'success');
    static FAIL = new ResultCode(40000, 'fail');
}

module.exports = ResultCode