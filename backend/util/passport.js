const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userModel = require("../model/user-model")

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.PASSPORT_SECRET;
    passport.use(
        new JwtStrategy(opts, function (jwt_payload, done) {
            userModel.getUserById(jwt_payload.id)
                .then((user) => {
                    if (user) {
                        done(null, user)
                    } else {
                        done(null, false)
                    }
                })
        })
    );
};
