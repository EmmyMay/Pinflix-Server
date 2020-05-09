const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/users')
const jwt = require('passport-jwt')



const options = {}

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (options, async function (email, password, done) {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return done(null, false, {
                message: "You don't exist here yet sorry"
            })
        }
        if (!user.comparePassword(password, function (err) {
                if (err) throw err

            })) {

            return done(
                null,
                false, {
                    message: 'Password is incorrect'
                }
            )
        }
        return done(null, user)

    })

))


passport.use(new jwt.Strategy({
        jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    (payload, done) => {
        User.findById(payload.id)
            .then(user => {
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            }, err => done(err))
    }))