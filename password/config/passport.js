const LocalStrategy = require('passport-local')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


//Load User Model 
const User = require('../models/user')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy ({usernameField : 'email'}, (email,password,done ) => {
            User.findOne({email : email})
            .then(user => {
                if (!user) {
                    return done(null,false,{message : 'That memail is not registered'})
                }

                bcrypt.compare(password, User.password, (err,isMatch) => {
                    if(err) throw err
                    if(isMatch) {
                        return done(null,user)
                    } else {
                        return done(null,false, {message : 'Password incorrect'})
                    }
                })
            })
            .cathc(err => console.log(err))

        })
    )



    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
}