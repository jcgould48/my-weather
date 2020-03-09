const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('./models/User')
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');


// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', function(req, res, next) {
  return res.render('main/home', {errors: req.flash('errors')})
});



// router.get('/home2',(req, res, next)=>
// {if(req.isAuthenticated()){
//   return res.render('main/home2', {errors: req.flash('errors')})
// } else {
//   return res.send('Unauthorized')
// }
// })

router.get('/home2', userController.getWeather);

router.get('/register', function(req, res, next){
  res.render('auth/register', {errors: req.flash('errors')})
})

//links to controllers
router.post('/register',userValidation, userController.register)


//login
router.get('/login', (req, res)=>{
  return res.render('auth/login', {errors: req.flash('errors')});
}
);

router.post('/login', passport.authenticate('local-login',{
successRedirect: '/api/users/home2',
failureRedirect: '/api/users/login',
failureFlash: true

})
);


//updates profile
router.put('/update-profile',(req, res, next)=>{
  userController.
  updateProfile(req.body, req.user._id)
  .then((user)=>{
    return res.redirect('/api/users/profile')
  })

  .catch((err)=>{
    console.log(err);
    return res.redirect('/api/users/update-profile')
  })
})

router.get('/profile',(req, res, next)=>
{if(req.isAuthenticated()){
  return res.render('auth/profile')
} else {
  return res.send('Unauthorized')
}
})

router.get('/update-profile', (req, res, next)=>{
  if(req.isAuthenticated()){
    return res.render('auth/update-profile')
  }
  return res.redirect('/')
})

// update password
router.put('/update-password', (req, res)=>{
  userController.updatePassword(req.body, req.user._id)
  .then(user=>{
return res.redirect('/api/users/profile');
  })
  .catch(err => {
    return res.redirect('/api/users/update-profile')
  });
})




module.exports = router;
