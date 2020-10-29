const mongoose=require('mongoose');
const Schema=mongoose.Schema


const leadersSchema=new Schema({
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
    designation: {
        type: String,
        required :true
    },
    abbr: {
        type: String,
        required: true,
        
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
var Leaders =mongoose.model('leader',leadersSchema)
module.exports=Leaders;