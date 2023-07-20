const mongoose = require('mongoose');
const logger = require('../utils/logger')

mongoose.connect("mongodb://127.0.0.1:27017/reviewRating", { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Database connected')
    logger.log("info","MongoDB is Connected")
})

mongoose.connection.on('error', (err,res) => {
    console.log('Database error')
    console.log(err)
    logger.log("error","Mongoose Connection Error!! ")
})