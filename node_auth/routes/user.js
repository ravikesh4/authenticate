const express = require('express');
const router = express.Router();

// import controllers 
const { read, update, VendorRead } = require('../controllers/user');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.get('/user/:id', requireSignin, read)
router.put('/user/update', requireSignin, update)
router.put('/admin/update', requireSignin, adminMiddleware, update)
router.get('/user/post/:id', read)

// vendor list 
router.get('/vendors', VendorRead)

module.exports = router;