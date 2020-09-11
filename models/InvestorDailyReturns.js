const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const investorsdailyreturns = Schema({
  
    email: {
        type: String,
        required: true,
        // min:4 , 
        // max : 22 ,
        
      } , 
      userId :{
        type: String ,
        required: true,
      }  ,

      month:{
        type:Number ,
        
      } ,
      dailyprofit:[
        {type: Number}
      ]

});

module.exports = mongoose.model( 'investorsdailyreturns' , investorsdailyreturns )