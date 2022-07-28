const {Restaurant} =require('../Models/restaurantModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');

var multer = require('multer');
const fs = require('fs');
var dateFormat = require('dateformat');
const {User, validateDownloadData} =require('../Models/userModel')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/upload',upload.array('myFiles'),async(req,res)=>{
    const files = req.files
    let arr=[];
    files.forEach(element => {
    
      arr.push(element.path)
 
    })
    return res.send(arr)
})



router.post('/newRestaurant', async(req,res)=>{
    
    const restaurant=new Restaurant(req.body)

    const result=await restaurant.save()
    return res.send({status:true,resultat:result})
})




router.post('/modifierRestaurant/:id', async(req,res)=>{
    
    /*const {error}=validateRestaurant(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    */
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})
    
    const restaurant = await Restaurant.findById(req.params.id)
    
    if(!restaurant) return res.status(401).send({status:false}) 

    const result = await Restaurant.findOneAndUpdate({_id:req.params.id},req.body)

    const restaurant2 = await Restaurant.findById(req.params.id)

    return res.send({status:true,resultat:restaurant2})
})


const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};


router.post('/listRestaurants', async(req,res)=>{
  
    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        //populate: 'Restaurant'
        sort:{
            createdAt: -1 
        }
    };

    const result=await Restaurant.paginate({}, options)
    return res.send({status:true,resultat:result, request:req.body})
    
})


router.post('/deleteRestaurant/:id', async(req,res)=>{
    
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const restaurant = await Restaurant.findById(req.params.id)
    
    if(!restaurant) return res.status(401).send({status:false})

    if(await Restaurant.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
    }

})

 router.get('/getById/:id', async(req,res)=>{

    if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})
  
    const restaurant = await Restaurant.findOne({_id:req.params.id})
    
    return res.send({status:true,resultat:restaurant}) 
    
})


function verifytoken(req, res, next){

  const bearerHeader = req.headers['authorization'];
  
  if(typeof bearerHeader !== 'undefined'){
 
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, 'secretkey', (err, authData) => {
          if(err){
              res.sendStatus(403);
          }else{
              req.user = authData;
              next();
          }
      });
  
  }else{
     res.sendStatus(401);
  }

}

module.exports.routerRestaurant=router