const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const reports = Schema({
    title : {
        type: String,
        required: true , 
        min:4 , 
        max : 22 ,
        unique: true ,
      } ,
    url: {
        type: String,
        required: true,
      },
      date:{
        type:Date , 
        default: Date.now,
      }

});

module.exports = mongoose.model( 'reports' , reports )