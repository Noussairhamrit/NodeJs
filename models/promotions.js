const mongoose=require('mongoose');
const Schema=mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;


const promotionsSchema=new Schema({
    name :{
        type :String    ,
        require :true,
        minlength :2,
        maxlength :25
    },
    image :{
        type :String    ,
        require :true
        
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description:{
        type: String,
        require:true
    },
    featured: {
        type: Boolean,
        default:false      
    },
});
var Promotions =mongoose.model('promotions',promotionsSchema)
module.exports=Promotions;