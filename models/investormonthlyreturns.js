const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const investorsmonthlyreturns = Schema({
  
    email: {
        type: String,
        required: true,
        min:4 , 
        max : 22 ,
        
      },
 
     
      amount:{
        type:Number , 
        default: 0 


      } , 
     
      returns:{
          type:Number , 
          default: 0
      } ,

      month:{
        type:Number , 
        default: 0,
        
      }, 
      revenue:{
        type:Number , 
        default: 0
      } , 
      package:{

        type:String ,
        default: '' 
      } ,
      packageprecent:{
          type:Number , 
          default: 0
      } ,
      startDay :{

        type:Number , 
        default: 1
      },
      endDay :{

        type:Number , 
        default: 30
      }

});

module.exports = mongoose.model( 'investorsmonthlyreturns' , investorsmonthlyreturns )