const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')

exports.postById = (req, res, next, id) => {
    post.findById(id)
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

        const { title, description, category, photo, postedBy } = post;

        if (!title || !description) {
            return res.status(400).json({
                error: 'Title and description fields are required'
            })
        }

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


exports.read = (req, res) => {
    // Product.find({_id: {$ne: req.product}, category: req.product.category})

    Post.find({varified: 'yes'}).exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: "No not found"
            })
        }
        res.json(post)
    })
}


// exports.updatePost = (req, res) => {
//     const postId = req.params.id
//     Post.findByIdAndUpdate({postId}, {$set: req.body}, {new: true}, (err, post) => {
//         if(err) {
//             return res.status(400).json({
//                 error: 'You are not authorized'
//             })
//         }
//         res.json(post);
//     })
// }