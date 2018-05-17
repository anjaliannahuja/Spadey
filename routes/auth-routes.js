const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../database-pg/helper');

// auth login
// router.get('/login', (req, res) => {
//   res.redirect('Login');
// });

router.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.send(req.user);
});

// auth register
router.post('/register', (req, res) => {
  createUser(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) {
          res.status(500);
          res.send('Server Error');
        }
        res.send('Success');
      });
    })
    .catch(err => {
      res.status(500);
      res.send(err);
    });
});

// auth logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/#/record');
});

module.exports = router;
