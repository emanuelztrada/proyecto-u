const mongoose = require('mongoose'); 
require('dotenv').config({ path: '.env'}); 

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {

        }); 
        console.log('Connection succell'); 

    } catch (error) {
        console.log('Connection failed'); 
        console.log(error); 
        process.exit(1); //Detiene la app
    }
}

module.exports = connection; 