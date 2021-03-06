const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema.Types

// user schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 35
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        loadClass: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: String,
    },
    mobile: {
        type: String,
    },
    company: {
        type: String,
    },
    address: {
        type: String,
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    messages: [{ type: ObjectId, ref: "User"}],
}, {timestamps: true})

// virtual fields 
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

// methods 
userSchema.methods = {

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password) {
        if(!password) return ''
        try {
            return crypto.createHash('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch(err) {
            return ''
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}


module.exports = mongoose.model('User', userSchema)