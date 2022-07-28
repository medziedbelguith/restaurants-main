const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const schemaUser=mongoose.Schema({
    
       nom: {type: String, default: ""},
       num: {type:Number,default: 0},
       prenom: {type: String, default: ""},
       password: {type: String, default: ""},
       email: {type: String, default: "", unique: true},
       telephone: {type: String, default: ""},
       adresse: {type: String, default: " "},
       ville: {type: String, default: " "},
       pays: {type: String, default: " "},
       role: {type: String, default: "client"},
       codePostal: {type: String, default: " "},
       company: {type: String, default: " "},
       codeForgotPassword: {type: String, default: ""},
       
       
    },
    {
         timestamps: true 
    },
)

schemaUser.plugin(mongoosePaginate);

  schemaUser.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


const User=mongoose.model('User',schemaUser)


function validateUser(user){

    
    const schema=Joi.object({
    
        nom: Joi.string().allow('', null),
        prenom: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        ville: Joi.string().allow('', null),
        pays: Joi.string().allow('', null),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        codePostal: Joi.string().allow('', null),
        company: Joi.string().allow('', null),
    })

    return schema.validate(user)
}

function validateUpdateUser(user){

    
    const schema1 = Joi.object({
        
        nom: Joi.string().allow('', null),
        prenom: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        ville: Joi.string().allow('', null),
        pays: Joi.string().allow('', null),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        newEmail: Joi.string().email().allow('', null),
        newPassword: Joi.string().min(6).allow('', null),     
        codePostal: Joi.string().allow('', null),
        company: Joi.string().allow('', null),

    })

    return schema1.validate(user)
}


function validateLogin(login){

    const schema2 = Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(6).required()
    })

    return schema2.validate(login)
}

function validateModifierMotPasse(request){

    const schema2 = Joi.object({
        email:Joi.string().required().email(),
        baseUrl:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}

function validateNewPassowrd(request){

    const schema2 = Joi.object({
        code:Joi.string().min(6).required(),
        newPassword:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}

function validateDownloadData(request){

    const schema2 = Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(6).required(),
        promoCategorie:Joi.string().min(3).required(),
    })

    return schema2.validate(request)
}


module.exports.User=User
module.exports.validateLogin=validateLogin
module.exports.validateUser=validateUser
module.exports.validateModifierMotPasse=validateModifierMotPasse
module.exports.validateNewPassowrd=validateNewPassowrd
module.exports.validateUpdateUser=validateUpdateUser
module.exports.validateDownloadData=validateDownloadData

