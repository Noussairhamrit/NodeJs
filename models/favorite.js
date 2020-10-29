const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const favoriteSchema= new  Schema({
    User:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes :  [{
        unique: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }]
    

},{
    timestamps: true
})


var Favorites=mongoose.model('favorit',favoriteSchema);

module.exports=Favorites;