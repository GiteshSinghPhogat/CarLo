const express = require('express');
const router = express.Router();
const catchAsync = require('../utilis/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const User = require('../controllers/users');

router.route('/register')
    .get(User.renderRegister)
    .post(catchAsync(User.register));

router.route('/login')
    .get(User.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), User.login);

router.get('/logout', User.logout);

module.exports = router;