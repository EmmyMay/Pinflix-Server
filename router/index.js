var router = require('koa-router');
var r = router();
const PinTweet = require('../model/twitter');
const PinTiktok = require('../model/tiktok');
const passport = require('koa-passport');
const jsonwebtoken = require('jsonwebtoken');
const passportStrategies = require('../passport')
const User = require('../model/users');
const checkauth = require('../utils/checkAuth');
require('dotenv').config();






// get route to handle Twitter posts
r.get('/pin/twitter', async (ctx) => {
    try {

        var tweets = await PinTweet.find();
        ctx.body = tweets;



    } catch (error) {

        ctx.body = "error: The Server timed-out " + error
    }

})
// get route to handle TikTok posts
r.get('/pin/tiktok', async (ctx) => {
    try {

        var tiks = await PinTiktok.find();
        ctx.body = tiks;



    } catch (error) {

        ctx.body = "error: The Server timed-out "
    }
})


r.get('/', (ctx) => {
    ctx.body = "Welcome"
})
// *******************************************************************

// route to handle Twitter pin posts
r.post('/pin/twitter', checkauth, async (ctx) => {

    // destructuring the data variables
    var {
        caption,
        handle,
        firsthref,
        date,
        secondhref
    } = ctx.request.body;

    const found = await PinTweet.findOne({
        secondhref: secondhref
    });
    // test to see if we already have that post present
    if (found) {
        ctx.body = {
            error: "Post already present",
        };
        // return proper http code!!!!!!!!!!!!!!!!!!!!!
        ctx.response.status = 403;


    }
    // If we do not, add it into the database
    else {
        const tweet = new PinTweet({
            handle: handle,
            caption: caption,
            firsthref: firsthref,
            secondhref: secondhref,
            date: date
        });
        tweet.save().then(() => {





        }).catch(err => {
            ctx.body = err + " error occurred";
        })

        ctx.body = {
            msg: "Tweet Post Added!"
        }

        ctx.response.status = 200;

    }



})

// *********************

// route to handle Tiktok pin posts
r.post('/pin/tiktok', checkauth, async (ctx) => {
    // destructuring the data variables
    var {
        cite,
        vidID

    } = ctx.request.body;

    const found = await PinTiktok.findOne({
        vidID: vidID
    });
    // test to see if we already have that post present
    if (found) {
        ctx.body = {
            error: "Post already present",
        };
        // return proper http code!!!!!!!!!!!!!!!!!!!!!
        ctx.response.status = 403;


    }
    // If we do not, add it into the database
    else {
        const tik = new PinTiktok({
            cite: cite,
            vidID: vidID
        });
        tik.save().then(() => {




        }).catch(err => {
            ctx.body = err + " error occurred";
        })
        ctx.body = {
            message: " Tiktok Post added! "
        }
        ctx.response.status = 200;
    }



})

//  login route
r.post('/pin/login', async ctx => {

    await passport.authenticate(
        'local',
        (err, user, info, ) => {
            if (err) {
                ctx.throw(err.status)
            } else if (!user) {
                ctx.body = {
                    info
                }
            } else {
                const payload = {
                    id: user.id

                }

                const token = jsonwebtoken.sign(
                    payload,
                    process.env.JWT_SECRET, {
                        expiresIn: '2d'
                    }

                )

                ctx.body = {
                    token: token,
                    email: user.email

                }
                ctx.response.status = 200
            }
        }
    )(ctx)
})

r.post('/pin/register', async ctx => {


    const {
        email,
        password,
        name

    } = ctx.request.body;

    const found = await User.findOne({
        email: email
    });

    if (found) {

        ctx.body = {
            message: "You are already one of us"
        }
        ctx.status = 403;

    } else {
        const user = new User({
            email,
            password,
            name
        });



        await user.save().then(() => {


            ctx.status = 201;
            ctx.body = {
                message: "You are now one of us!"
            }

            return
        })
    }







})


module.exports = r;