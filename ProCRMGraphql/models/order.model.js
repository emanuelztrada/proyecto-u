const mongoose = require('mongoose'); 

const orderSchema = mongoose.Schema({
   pedido: {
       type: Array, 
       required: true
   },
   total: {
       type: Number, 
       required: true
   },
   client:{
       type: mongoose.Schema.Types.ObjectId,
       required: true, 
       ref: 'cliente'
   },
   seller:{
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'user'
    }, 
    estado:{ 
        type: String, 
        default: "Pendiente"
    },
    create: {
        type: Date, 
        default: Date.now()
    }
}); 

module.exports = mongoose.model('order', orderSchema); 