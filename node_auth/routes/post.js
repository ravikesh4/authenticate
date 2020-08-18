const express = require('express');
const router = express.Router();

const { create, read, postById, readOne, updatePost } = require('../controllers/post')

// import validators 
const { postValidator } = require('../validators/post')
const { runValidation } = require('../validators/index')
const { requireSignin } = require('../controllers/auth');


router.post('/post', requireSignin, create)
// router.post('/post/update/:id', requireSignin, updatePost)
router.get('/post', read)
router.get('/post/:id', readOne)

router.param('postId', postById)
module.exports = router;
