const mongoose =require('mongoose')

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 150,
        },
        email: {
            type: String,
            required: true,
            maxlength: 50,
        },
        mobile: {
            type: String,
            required: true,
            maxlength: 10,
        },
        msg: {
            type: String,
            required: true,
            maxlength: 150,
        },
    
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);