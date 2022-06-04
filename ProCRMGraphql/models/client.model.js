const mongoose = require('mongoose'); 

const clientSchema = mongoose.Schema({
    firstname: {
        type : String,
        required: true, 
        trim: true
    },
    lastname: {
        type : String,
        required: true, 
        trim: true
    },
    business: {
        type : String,
        required: true, 
        trim: true,
        unique: true
    },
    email: {
        type : String,
        required: true, 
        trim: true,
        unique: true
    },
    phone: {
        type : String,
        trim: true,
    },
    create: {
        type: Date,
        default: Date.now()
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    }
}); 

module.exports = mongoose.model('cliente', clientSchema); 