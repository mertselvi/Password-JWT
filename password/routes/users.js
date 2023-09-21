const express = require ('express')
const router = express.Router();    //Express router nedir ?
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const { db } = require('../models/user');
const passport = require ('passport')

router.get('/login', (req,res) => {
    res.render('login')
})

router.get('/register', (req,res) => {
    res.render('register')

})

router.post('/register', (req,res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    //Check required fields 
    if (!name || !email ||!password || !password2) {
        errors.push({msg: 'Please fill all fields'})
        console.log(errors)
    }

    if(password !== password2) {
        errors.push({msg: 'Passwords do not match.'})
        console.log(errors)
    }
    if(password.length < 6){
        errors.push({msg : 'Password should be at least 8 characters'})
        console.log(errors)
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //Validation of password.
        User.findOne({email: email})
        .then(user => {
            if(user){
                //user exists
                errors.push({msg: 'Email has  already used'})
                console.log(user)
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password 
                bcrypt.genSalt(10, (err,salt)=> bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if (err) throw err;
                    //Set password to hashed
                    newUser.password = hash;
                    //Save USer
                    newUser.save()
                    .then(user => {
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }))
            }
        });

    }
})


// Login Handle 
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        succedRedirect : '/dashboard',
        failureRedirect : '/users/login'
    })(req,res,next)
})



module.exports = router