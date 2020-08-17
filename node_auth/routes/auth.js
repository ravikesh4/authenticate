const express = require('express');
const router = express.Router();

// import controllers 
const { signup, accountActivation, signin, forgotPassword, resetPassword } = require('../controllers/auth');

// import validators 
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth')
const { runValidation } = require('../validators/index')

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin', userSigninValidator, runValidation, signin)

// forget reset password 
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

module.exports = router;