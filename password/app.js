const express = require ('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')        //npm için
require('./config/passport')(passport);     //Config altındaki passport dosyası için

app.use(expressLayout)
app.set('view engine', 'ejs')       //view engin ejs nedir bak

//Db connection 
const db = require('./config/key').mongoURI

//Connect to DB
mongoose.connect(db, {useNewUrlParser : true})
.then(()=> console.log('mongoDB connected'))
.catch((err)=> console.log(err))

//BodyParser        Formdan verileri almak için sanırım bunu da araştır
app.use(express.urlencoded({extended : false}))

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}))

//Connect flash 
app.use(flash())

//Globalar variables 

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('succes_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))        //users altında register ve login url'lerini çalıştıyor.

app.listen (8081, ()=> {
    console.log('server started')
})



