const ResultCode = require('./ResultCode');

class Result {
	code;
	msg;
	data;

	constructor (code, msg, data) {
		this.code = code;
		this.msg = msg;
		this.data = data;
	}

	static success (data) {
		return new Result(ResultCode.SUCCESS.code, ResultCode.SUCCESS.desc, data);
	}

	static failUpdate () {
		return new Result(ResultCode.UPDATE_FAIL.code, ResultCode.UPDATE_FAIL.desc, null);
	}

	static failSignup () {
		return new Result(ResultCode.FAIL_SIGNUP.code, ResultCode.FAIL_SIGNUP.desc, null);
	}

	static fail (msg) {
		if (msg === undefined || msg === null) { msg = ResultCode.FAIL.desc; }
		return new Result(ResultCode.FAIL.code, msg, null);
	}

	static invalidUserId () {
		return new Result(ResultCode.INVALID_USERID.code, ResultCode.INVALID_USERID.desc, null);
	}

	static invalidPostId () {
		return new Result(ResultCode.INVALID_POSTID.code, ResultCode.INVALID_POSTID.desc, null);
	}

	static invalidEmail () {
		return new Result(ResultCode.INVALID_EMAIL.code, ResultCode.INVALID_EMAIL.desc, null);
	}

	static invalidPassword () {
		return new Result(ResultCode.INVALID_PASSWORD.code, ResultCode.INVALID_EMAIL.desc, null);
	}

	static invalidAudienceId () {
		return new Result(ResultCode.INVALID_AUDIENCE_ID.code, ResultCode.INVALID_AUDIENCE_ID.desc, null);
	}

	static invalidCreatorId () {
		return new Result(ResultCode.INVALID_CREATOR_ID.code, ResultCode.INVALID_CREATOR_ID.desc, null);
	}

	static alreadySubscribe () {
		return new Result(ResultCode.ALREADY_SUBSCRIBE.code, ResultCode.ALREADY_SUBSCRIBE.desc, null);
	}

	static notSubscribe () {
		return new Result(ResultCode.NOT_SUBSCRIBE.code, ResultCode.NOT_SUBSCRIBE.desc, null);
	}

	static idsConflict () {
		return new Result(ResultCode.ID_CONFLICT.code, ResultCode.ID_CONFLICT.desc, null);
	}

	static failNotify () {
		return new Result(ResultCode.FAIL_NOTIFICATION.code, ResultCode.FAIL_NOTIFICATION.desc, null);
	}
}

module.exports = Result;
