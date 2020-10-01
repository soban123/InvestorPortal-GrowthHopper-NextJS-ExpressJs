const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const news = Schema({
    title : {
        type: String,
        required: true , 
        min:4 , 
        max : 22 ,
        unique: true ,
      } ,
    text: {
        type: String,
        required: true,
        min:4 , 
      },
      date:{
        type:Date , 
        default: Date.now,
      }

});

module.exports = mongoose.model( 'news' , news )