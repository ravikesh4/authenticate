const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    category: {
        type: String,
        ref: 'Category',
        default: 'all'
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    additional: {
        type: String,
    },
    product: {
        type: String,
    },
    varified: {
        type: String,
        default: 'no'
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)
