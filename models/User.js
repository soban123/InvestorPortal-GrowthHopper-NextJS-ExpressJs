const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const users = Schema({
    name : {
        type: String,
        required: true , 
        min:4 , 
        max : 22 ,
        unique: true ,
      } ,
    email: {
        type: String,
        required: true,
        min:4 , 
        max : 22 ,
        unique: true ,
      },
    password: {
        type: String,
        required: true ,
        min:4 , 
        max : 22 ,
      } ,
    role:{
        type: String,
        required: true,
        min:4 , 
        max : 22 ,
      } , 
      status:{
          type:Number ,
          default:1
      } ,
      amount:{
        type:Number , 
        default: 0 


      } , 
      package:{
        type:String , 
        default:"none"

      } ,
      date:{

        type:Date , 
        default: Date.now,
        
      },
      month:{
        type:Number , 
        default: 0,
        
      }

});

module.exports = mongoose.model( 'users' , users )