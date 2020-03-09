const User = require('../models/User');
const{validationResult} = require('express-validator')
const faker = require('faker');
const bcrypt = require('bcryptjs')

module.exports = {
//registers new users to database
    register: (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()
        })}
    const {name, email, password} = req.body;
    User.findOne({email})
    .then((user)=>{
        // if (user) return req.flash('errors', 'User Already Exists')
     if (user) return console.log('User Exists')
     else{
    const newUser = new User();
  
    newUser.profile.name = name
    newUser.profile.picture = faker.image.avatar();
    newUser.email = email
    newUser.password = password;
  
    newUser.save().then((user) => {
    req.login(user, err => {
        if(err){
            return res.status(400).json({confirmation: false, message: err})
            }
            else{
                res.redirect('/api/users/home2');
                next();
            }
    })
  })
  .catch(err => {
   return next(err);
  });
  }
  })
  },

  updateProfile: (params, id) => {
    const {name, email, zip} = params
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then(user => {
          
          if (name) user.profile.name = name;
          if (email) user.email = email;
          if (zip) user.zip = zip;
          return user;
        })
        .then(user => {
          user.save().then(user => {
            resolve(user);
          });
        })
        .catch(err => reject(err));
    }).catch(err => reject(err));
  },
  
  updatePassword: (params, id)=>{
    return new Promise((resolve, reject)=>{
        User.findById(id)
        .then((user)=>{
            if(!params.oldPassword || !params.newPassword || !params.repeatNewPassword){
                reject('All password inputs must be filled');
            } else if(params.newPassword !== params.repeatNewPassword){
                reject('New passwords do not match')
            } else{
                bcrypt.compare(params.oldPassword, user.password)
                .then((result)=>{
                    if(result === false){
                        reject('Old Password Incorrect')
                    } else{
                        user.password = params.newPassword;
                        user.save()
                        .then(user=>{
                            resolve(user);
                        })
                    }
                })
                .catch(err=>{
                    throw new Error(err);
                });
            }
        })
        .catch(err=>{
            reject(err);
        });
    })
},

getWeather: (req, res) => {
    const apiKey = process.env.API_KEY
    const url = `api.openweathermap.org/data/2.5/forecast/daily?zip=${zip},us&appid=${apiKey}`;

    fetch(url)
        .then((res) => res.json())
        .then((movies) => {
            res.render('main/home2', { movies, img })
        })
        .catch((err) => console.log(err))
}

}