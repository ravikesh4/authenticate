const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const _ = require('lodash')

// sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.signup = (req, res) => {
//     // console.log('Request Body On Signup', req.body);
//     const {name, email, password} = req.body;
// User.findOne({email: email}).exec((err, user) => {
//     if(user) {
//         return res.status(400).json({
//             error: 'Email is taken'
//         })
//     }
// })

//     let newUser = new User({name, email, password})

//     newUser.save((err, success) => {
//         if(err) {
//             console.log('Signup Error', err);
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         res.json({
//             message: 'Signup Success please signin',
//             user: newUser
//         })
//     })
// }


exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Account activation link`,
            text: `Msg for verification`,
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        sgMail
            .send(emailData)
            .then(sent => {
                // console.log('SIGNUP EMAIL SENT', sent)
                return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                });
            })
            .catch(error => {
                // console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.json({
                    message: error.message
                });
            });
    });
};


exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    message: 'Expired link, signup again'
                })
            }

            const { name, email, password } = jwt.decode(token)

            // saving data in database 
            const user = new User({ name, email, password })

            user.save((err, user) => {
                if (err) {
                    console.log('Save user in account activation error', err);
                    return res.status(401).json({
                        error: 'Error saving using in database, try signup again'
                    })
                }
                return res.json({
                    user: user,
                    message: 'Signup success, please signin'
                })
            })
        })
    } else {
        return res.status(401).json({
            error: 'Something went wrong try again'
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body
    // check if user exist 
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Users does not exist, please signup'
            })
        }

        //authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and Password does not matched'
            })
        }
        // generate token and send to client 
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const { _id, name, email, role } = user

        return res.json({
            token,
            user: { _id, name, email, role }
        })
    })

}

exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET
})

exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access Denied'
            })
        }

        req.profile = user;
        next();

    })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })
        }

        const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Reset password link`,
            text: `Msg for password reset`,
            html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('Reset Password Link', err);
                return res.status(400).json({
                    error: 'Database connection error on password fogot request'
                })
            } else {
                sgMail
                    .send(emailData)
                    .then(sent => {
                        // console.log('SIGNUP EMAIL SENT', sent)
                        return res.json({
                            message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                        });
                    })
                    .catch(error => {
                        // console.log('SIGNUP EMAIL SENT ERROR', err)
                        return res.json({
                            message: error.message
                        });
                    });
            }
        })

    })
}

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired Link, Try Again'
                })
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Something went wrong, Try later'
                    })
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)

                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: 'Something went wrong while resetting password, Try later'
                        })
                    }
                    res.json({
                        message: `Great! Now you can login with new password`
                    })
                })

            })
        })
    }

}