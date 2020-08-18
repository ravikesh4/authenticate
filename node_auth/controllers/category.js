
const Category = require('../models/category')


exports.create = (req, res) => {
    const { name } = req.body;

    let newCategory = new Category({ name })

    newCategory.save((err, success) => {
        if(err) {
            console.log('Category Error', err);
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: 'Category posted Successful',
            category: newCategory
        })
    })
}

exports.read = (req, res) => {

    Category.find().exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "No not found"
            })
        }
        res.json(category)
    })
}