const koa = require('koa');
const app = new koa();
const _ = require('./router');
const mongoose = require('mongoose');
const bodyparser = require('koa-body');
const cors = require('@koa/cors');
const passport = require('koa-passport');
const helmet = require("koa-helmet");





const koaOptions = {
    origin: true,
    credentials: true
};



app.use(helmet());
app.use(bodyparser());

app.use(passport.initialize());

app.use(_.routes());
app.use(cors(koaOptions));


// mongoose config


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch((ctx, err) => {
    ctx.status = 500;
    ctx.body = err;


})
mongoose.connection.once('open', () => {
    console.log("Connection Made");
})
app.listen(process.env.PORT, () => {

    console.log(`App listening on port ${process.env.PORT}!`);




});