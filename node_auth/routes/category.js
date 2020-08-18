const express = require('express');
const router = express.Router();

const { create, read } = require('../controllers/category')

// import validators 
const { categoryValidator } = require('../validators/category')
const { runValidation } = require('../validators/index')
const { requireSignin } = require('../controllers/auth');


router.post('/category', categoryValidator, requireSignin, runValidation, create)
router.get('/category', read)

module.exports = router;
