const User = require('../models/user')

exports.read = (req, res) => {
    const userId = req.params.id

    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "user not found"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined
        res.json(user)
    })
}

exports.VendorRead = (req, res) => {

    User.find({ "role": "vendor"}).exec((err, vendor) => {
        if (err || !vendor) {
            return res.status(400).json({
                error: "vendors not found"
            })
        }
        vendor.hashed_password = undefined;
        vendor.salt = undefined;
        res.json(vendor)
    })
}

exports.update = (req, res) => {
    // console.log('Update User - req.user', req.user, 'Update data', req.body);
    const { name, password, email, mobile, company, address } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (!name || !email || !mobile || !company || !address) {
            return res.status(400).json({
                error: 'All fields is required'
            })
        } else {
            user.name = name;
            user.email = email;
            user.mobile = mobile;
            user.company = company;
            user.address = address;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be minium 6 character'
                })
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('User update error', err);
                return res.status(400).json({
                    error: 'User update failed'
                })
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser)
        })

    })
}