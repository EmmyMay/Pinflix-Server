const koa = require('koa');
const app = new koa();
const _ = require('./router/index');
const mongoose = require('mongoose');
const bodyparser = require('koa-body');
const cors = require('@koa/cors');
const passport = require('koa-passport')
require('dotenv').config();












app.use(bodyparser());

app.use(passport.initialize());

app.use(_.routes());
app.use(cors());



// mongoose config


mongoose.connect(`mongodb+srv://${process.env.dbname}:${process.env.dbpass}@vue-8buqu.mongodb.net/embed?retryWrites=true&w=majority`, {
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
app.listen(process.env.port, () => {

    console.log(`App listening on port ${process.env.port}!`);




});