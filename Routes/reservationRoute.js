const {Reservation} =require('../Models/reservationModel')
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


router.post('/newReservation', async(req,res)=>{
    
    
    //if(req.user.user.role != "admin") return res.status(401).send({status:false})
    
    
    const reservation=new Reservation(req.body);

    const result=await reservation.save()

   
    return res.send({status:true,resultat:result})
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
 



router.post('/listReservations', async(req,res)=>{
  
  const options = {
    page: req.body.page,
    limit: Number(req.body.limit) ,
    customLabels: myCustomLabels,
    sort:{
      createdAt: -1 
    }
  };

  const result=await  Reservation.paginate({}, options) 
  return res.send({status:true,resultat:result, request:req.body})

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

module.exports.routerReservation=router
