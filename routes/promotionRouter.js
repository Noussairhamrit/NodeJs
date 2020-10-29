const express=require('express');
const bodyparser=require('body-parser');
const promotionRouter=express.Router();
promotionRouter.use(bodyparser.json());
const Promotion=require('../models/promotions');
var authenticate = require('../authenticate');

const cors = require('./cors');





promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors,(req,res,next)=>{
     /* Promotion.find({}) */
     Promotion.find(req.query) ////pour angular
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.create(req.body).then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('PUT operation not supported on /Promotion')
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.remove().then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
 })

////////////////////////  '/:promoId'
promotionRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors,(req,res,next)=>{
    Promotion.findById(req.params.promoId).then((promtion)=>{
        if(promtion !=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promtion);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
 })


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{

    res.end('POST operation not supported on /promotion/'+ req.params.promoId)
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.findByIdAndUpdate(req.params.promoId,
       { $set:req.body} ,{new:true}).then((promtion)=>{
        if(promtion !=null){

            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promtion);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
 })


.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   
    Promotion.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
             res.statusCode=200;
             res.setHeader('Content-Type','application/json');
             res.json(resp);
         
     },(err)=>next(err))
     .catch((err)=>next(err))
  })


module.exports=promotionRouter;