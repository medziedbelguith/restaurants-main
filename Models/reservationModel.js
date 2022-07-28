const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const schemaReservation=mongoose.Schema({
    
    nom:{type:String, default: ""},
    email:{type:String, default: ""},
    telephone:{type:String, default: ""},
    nbrPlaces:{type:String, default: ""},
    restaurant:{type:String, default: ""},
    date:{type:String, default: ""},
    heure:{type:String, default: ""}

},
{ timestamps: true })

schemaReservation.plugin(mongoosePaginate);

schemaReservation.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Reservation=mongoose.model('Reservation',schemaReservation)




module.exports.Reservation=Reservation
