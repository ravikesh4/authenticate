const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const user = require('../models/user')


exports.postById = (req, res, next, id) => {
    Post.findById(id)
        // .populate(user)
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: "Didn't got post id"
                })
            }
            req.post = post
            next();
        })
}

// exports.postByUser = (req, res, next, id) => {
//     user.findById(id)
//         // .populate(user)
//         .exec((err, user) => {
//             if (err || !user) {
//                 return res.status(400).json({
//                     error: "Didn't got user id"
//                 })
//             }
//             req.user = user
//             next();
//         })
// }


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)

        const { title, category, product, photo, description, additional, postedBy } = post;

        if (!title || !description || !category || !product || !postedBy) {
            return res.status(400).json({
                error: 'Title, category, product, description fields are required'
            })
        }
        // console.log(title, category, product, image, description,   additional, postedBy);

        if (files.photo) {
            // console.log(files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                })
            }
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                })
            }
            res.json(result);
        })

    })

    // let newPost = new Post({ title, description, category, photo, postedBy })

    // newPost.save((err, success) => {
    //     if (err) {
    //         console.log('Post Error', err);
    //         return res.status(400).json({
    //             error: err
    //         })
    //     }
    //     res.json({
    //         message: 'Data posted Success, It will be shown after admin review',
    //         post: newPost
    //     })
    // })
}

// exports.read = (req, res) => {
//     req.product.photo = undefined
//     return res.json(req.product);
// }

exports.readOne = (req, res) => {
    const postId = req.params.id

    Post.findById(postId).exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }
        res.json(post)
    })
}

exports.postPhoto = (req, res) => {
    const postId = req.params.id

    Post.findById(postId).exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }
        res.json(post)
    })
}

exports.postPhoto = (req, res, next) => {
    // const postId = req.params.id
    // Post.findById(postId).exec((err, post) => {

        if (req.post.photo.data) {
            res.set('Content-Type', req.post.photo.contentType)
            return res.send(req.post.photo.data)
        }
        next();
    // })
}

exports.read = (req, res) => {
    // Product.find({_id: {$ne: req.product}, category: req.product.category})

    Post.find({ varified: 'no' }).exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: "No not found"
            })
        }
        res.json(post)
    })
}

exports.userPost = (req, res) => {
    // Product.find({_id: {$ne: req.product}, category: req.product.category})
    
    Post.find({ postedBy: req.params.userId }).exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: "No post found"
            })
        }
        res.json(post)
    })
}

exports.updatePost = (req, res) => {
    const postId = req.params.id
    const { verified } = req.body;

    console.log(verified);
    console.log(postId);

    Post.updateOne({ _id: postId }, {
        $set: { verified: verified }
    })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
}
