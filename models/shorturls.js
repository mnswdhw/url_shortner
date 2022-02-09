const mongoose=require('mongoose')
const shortId= require('shortid')


const shortUrlSchema= new mongoose.Schema({
    // createdAt: { type: Date, expireAfterSeconds: 86400, default:Date.now() },
    expireAt:{
        type:Date,
        required:true,
        default:new Date((new Date().valueOf()) + (60*1000*60*24))
    },
   fullurl:{
       type: String,
       required:true
      
   },
   shorturl:{
       type:String,
       required:false,
       default:shortId.generate
       
   },
   Clicks:{
       type:Number,
       required:false,
       default:0
   }

});

shortUrlSchema.index({expireAt:1},{expireAfterSeconds:0});


module.exports= mongoose.model('ShortUrl',shortUrlSchema)