const {Plat} =require('../Models/platModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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


router.post('/newPlat', async(req,res)=>{
    
    
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})
    
    
    const plat=new Plat(req.body);

    const result=await plat.save()

   
    return res.send({status:true,resultat:result})
})


router.post('/modifierPlat/:id', async(req,res)=>{
    
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})
    
    const plat = await Plat.findById(req.params.id)
    
    if(!plat) return res.status(401).send({status:false}) 

   
    const result = await Plat.findOneAndUpdate({_id:req.params.id},req.body)

    const plat2 = await Plat.findById(req.params.id)

    return res.send({status:true,resultat:plat2})
})


router.post('/deletePlat/:id', async(req,res)=>{
    
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const plat = await Plat.findById(req.params.id)
    
    if(!plat) return res.status(401).send({status:false})

    
    if(await Plat.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
    }

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
 



router.post('/listPlats', async(req,res)=>{
  
  const options = {
    page: req.body.page,
    limit: Number(req.body.limit) ,
    customLabels: myCustomLabels,
    sort:{
      createdAt: -1 
    }
  };

  const result=await  Plat.paginate({}, options) 
  return res.send({status:true,resultat:result, request:req.body})

})

router.get('/getById/:id', async(req,res)=>{

  if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

  const plat = await Plat.findOne({_id:req.params.id})
  
  return res.send({status:true,resultat:plat}) 
  
})

router.get('/getByRestaurant/:id', async(req,res)=>{

  if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

  const plats = await Plat.find({restaurant:req.params.id}).populate('restaurant')
  
  return res.send({status:true,plats:plats}) 
  
})

router.get('/getAllPlats', async(req,res)=>{

  
  const plats = await Plat.find({}).populate('restaurant')
  
  return res.send({status:true,plats:plats}) 
  
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

module.exports.routerPlat=router
