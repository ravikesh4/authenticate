const { check } = require('express-validator')

exports.postValidator = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),

    check('description')
        .not()
        .isEmpty()
        .withMessage('Description is required'),
]