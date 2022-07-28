const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const schemaPlat=mongoose.Schema({
    
    nom:{type:String, default: ""},
    prix:{type:Number, default: ""},
    photo:{type:String, default: ""},
    description:{type:String, default: ""},
    restaurant:{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
},
{ timestamps: true })

schemaPlat.plugin(mongoosePaginate);

schemaPlat.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Plat=mongoose.model('Plat',schemaPlat)




module.exports.Plat=Plat
