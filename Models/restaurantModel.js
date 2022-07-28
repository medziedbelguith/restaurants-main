const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaRestaurant=mongoose.Schema({
    
    nom:{type:String, default: ""},
    image:{type:String, default: ""},
    email:{type:String, default: ""},
    description:{type:String, default: ""},
    specialites:{type:String, default: ""},
    adresse:{type:String, default: ""},
    telephone:{type:String, default: ""},
  
},
{ timestamps: true }
)

schemaRestaurant.plugin(mongoosePaginate);

schemaRestaurant.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Restaurant = mongoose.model('Restaurant',schemaRestaurant)



module.exports.Restaurant=Restaurant
