const express = require('express');
const router = express.Router();

const { create, read, postById, readOne, updatePost, postPhoto, postByUser, userPost } = require('../controllers/post')

// import validators 
const { postValidator } = require('../validators/post')
const { runValidation } = require('../validators/index')
const { requireSignin, adminMiddleware } = require('../controllers/auth');


router.post('/post', requireSignin, create)
router.post('/post/update/:id', requireSignin, adminMiddleware, updatePost)
router.get('/post', read)
router.get('/post/:id', readOne)

router.get('/post/user/:userId', userPost)

router.param('postId', postById)
// router.param('userId', postByUser)
router.get('/post/photo/:postId', postPhoto)

module.exports = router;
