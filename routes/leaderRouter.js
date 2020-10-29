const express=require('express');
const  bodyparser=require('body-parser');
const bodyParser = require('body-parser');
const Leaders=require('../models/leaders');
const leaderRoute=express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');


leaderRoute.use(bodyParser.json());

leaderRoute.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })


.get(cors.cors,(req,res,next)=>{
    /* Leaders.find({}) */
    Leaders.find(req.query) ////pour angular
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body).then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('PUT operation not supported on /Leaders')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.remove().then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })

/////////////////////// /:promoId

leaderRoute.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Leaders.findById(req.params.promoId).then((leader)=>{
        if(leader !=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
 })


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{

    res.end('POST operation not supported on /Leaders/'+ req.params.promoId)
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.promoId,
       { $set:req.body} ,{new:true}).then((leader)=>{
        if(leader !=null){

            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
 })


.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   
    Leaders.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
             res.statusCode=200;
             res.setHeader('Content-Type','application/json');
             res.json(resp);
         
     },(err)=>next(err))
     .catch((err)=>next(err))
  })

module.exports=leaderRoute;