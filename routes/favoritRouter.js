const express = require('express');
const bodyParser = require('body-parser');

/** */
const mongoose=require('mongoose');
const Favorites=require('../models/favorite');
const Dishes=require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');



/*** */

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {

    Favorites.findOne({User:req.user._id}).populate('User').populate('dishes')
    .then((favorite)=>{
        
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite);
        
       
 
    },(err)=>next(err))
    .catch((err)=>next(err))
 })

 .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    
   
        

            Favorites.findOne({User: req.user._id},(err,favorite)=>
            {
               
                if (favorite !=null) {
                   
                    for(var dish = 0; dish< req.body.length; dish++)
                    {
                        if(favorite.dishes.indexOf(req.body[dish]._id)< 0){
                           
                           favorite.dishes.push(req.body[dish]);
                        }
                        
                    }
             
                    favorite.save();
             res.statusCode=200;
            
             res.json(favorite);
            }
            else{ 
             Favorites.create({User : req.user._id },(err,favorite)=>{
                for(var dish = 0; dish< req.body.length; dish++)
                
                {
                    
                    favorite.dishes.push(req.body[dish]);
                }
                favorite.save();
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);

             })
         
         }
     
             
         } )

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Favorites.remove({User: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

/////////////////////////////   /:dishId
 favoriteRouter.route('/:dishId')
 .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
 .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
 .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {

    Dishes.findById(req.params.dishId).then((dish)=>{
        if(dish !=null){

            Favorites.findOne({User: req.user._id},(err,favorite)=>
            {
               
                if (favorite !=null) {

                    
                        if(favorite.dishes.indexOf(req.params.dishId)>=0){
                            res.send('this dish is already added to favorite')
                        }
                      else{
                        favorite.dishes.push(dish);
                        favorite.save();
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorite);
                      }
                     }
            else{ 
                favorite =new Favorites({
              User : req.user._id ,
              dishes : dish.id
          })
          favorite.save();
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(favorite);
         }
     
             
         } )

        }

       
       

    },(err)=>next(err))
    .catch((err)=>next(err))
   
})

.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({User: req.user._id},(err,favorite)=> {
        if(err){ return next(err); }
        if(!favorite){res.send('you dont have a favorite to delete dish')}
        else{
          var pos=  favorite.dishes.indexOf(req.params.dishId);
          if(pos>=0){
            favorite.dishes.splice(pos, 1); 
            favorite.save();    
            res.statusCode=200;
            res.json(favorite);
          }
          else{
              res.send('dish not exist')
          }
          
        }
     
    })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
module.exports =favoriteRouter;