const e = require('express')
const express= require('express')
const mongoose=require('mongoose')
const ShortUrl=require('./models/shorturls')
const app=express()

mongoose.connect('mongodb+srv://manasw:manas123@shorturl.0z026.mongodb.net/myDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.get('/', async (req,res)=> {
    // const shorturls=await ShortUrl.find()
    
    console.log("started!!")
    res.render('index')

})

app.post('/shortenurl', async (req,res)=>{
    console.log(req)
    console.log("above was the req")
    
    console.log(new Date((new Date().valueOf()) + (60*1000*60*24)),"this is the new value", new Date().valueOf())
    if(req.body.CustomUrl==""){

        let shorturls1=await ShortUrl.findOne({fullurl:req.body.LongUrl})

        if(shorturls1 == null){
            if(req.body.ExpiryTime==""){
                await ShortUrl.create({fullurl:req.body.LongUrl})
                shorturls1=await ShortUrl.findOne({fullurl:req.body.LongUrl})
                shorturls1.text="new url with 24 hrs expiry"
            }
            else{
                let date1=new Date((Date.now().valueOf())+req.body.ExpiryTime*60*60*1000)
                // let createdAt1 = {
                //     expireAfterSeconds:date1
                // }
                await ShortUrl.create({fullurl:req.body.LongUrl,expireAt:date1})
                shorturls1=await ShortUrl.findOne({fullurl:req.body.LongUrl})
                shorturls1.text="new url with "+req.body.ExpiryTime+" hour expiry"
        
            }
        }
        else{
            shorturls1=await ShortUrl.findOne({fullurl:req.body.LongUrl})
            shorturls1.text="Long url already present"
    
        }
        res.render('index',{shorturls1:shorturls1.shorturl,text:shorturls1.text})

       

    }

    else{
       console.log("0")
       let shorturls2 = await ShortUrl.findOne({fullurl:req.body.LongUrl})
       console.log("1")

        if(shorturls2 == null){
            let shorturls3 = await ShortUrl.findOne({shorturl:req.body.CustomUrl})
            if(shorturls3 == null){
                if(req.body.ExpiryTime==""){
                    await ShortUrl.create({fullurl:String(req.body.LongUrl), shorturl:String(req.body.CustomUrl)})
                    shorturls2=await ShortUrl.findOne({fullurl:req.body.LongUrl}) 
                    shorturls2.text = "Your costum url of new long url with 24 hr expiry"   
                }
                else{
                    let date1=new Date((Date.now().valueOf())+req.body.ExpiryTime*60*60*1000)
                    // let createdAt1 = {
                    //     expireAfterSeconds:date1
                    // }
                    await ShortUrl.create({fullurl:String(req.body.LongUrl), shorturl:String(req.body.CustomUrl),expireAt:date1})
                    shorturls2=await ShortUrl.findOne({fullurl:req.body.LongUrl}) 
                    shorturls2.text = "Your costum url of new long url with "+ req.body.ExpiryTime +" hour expiry"   

                }
                
                
            }
            else{
                if(req.body.ExpiryTime==""){
                    await ShortUrl.create({fullurl:String(req.body.LongUrl)})
                    shorturls2=await ShortUrl.findOne({fullurl:req.body.LongUrl})
                    shorturls2.text = "costum url already in use so use this url instead" 
                }
                else{
                    let date1=new Date((Date.now().valueOf())+req.body.ExpiryTime*60*60*1000)
                    // let createdAt1 = {
                    //     expireAfterSeconds:date1
                    // }
                    await ShortUrl.create({fullurl:String(req.body.LongUrl),expireAt:date1})
                    shorturls2=await ShortUrl.findOne({fullurl:req.body.LongUrl})
                    shorturls2.text = "costumise url already in use so use this url instead" 

                }
            }
            
        }

        else{
            console.log("3")
            // await ShortUrl.create({fullurl:req.body.LongUrl})
            shorturls2=await ShortUrl.findOne({fullurl:req.body.LongUrl})
            shorturls2.text = "long url already presnt"

        }
        console.log("4",shorturls2.shorturl)
        res.render('index',{shorturls1:shorturls2.shorturl,text:shorturls2.text})


    }
   
//    res.redirect('/')

})

app.get('/:shortUrl', async (req,res)=>{
   const shortUrl= await ShortUrl.findOne({shorturl:req.params.shortUrl})

   if(shortUrl ==null) return res.sendStatus(404)

   shortUrl.Clicks++
   shortUrl.save()
   res.redirect(shortUrl.fullurl)
})

app.listen(process.env.Port || 8002);
