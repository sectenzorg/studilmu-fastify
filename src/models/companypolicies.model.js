const mongoose = require("mongoose");
const CompanypoliciesSchema = new mongoose.Schema({
    docid:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true,
        trim: true
    },
    description:{
        type:String,
        required: true,
        trim: true
    },
    file_name:{
        type:String,
        required: true,
        trim: true
    },
    file_type:{
        type:String
    },
    createdate:{
        type:Date
    },
    createby:{
        type:String
    },
    creatorname:{
        type:String
    },
    creatoremail:{
        type:String
    },
    lastupdatetime:{
        type:Date
    },
    lastupdateby:{
        type:String
    },
    lastupdatename:{
        type:String
    },
    lastupdateemail:{
        type:String
    },
    status:{
        type:String
    },
    file_url: {
        type: String
    },
    departmentname:{
        type: String
    }
});
CompanypoliciesSchema.index({ docid: 'text',status: 'text'});
const Companypolicies = mongoose.model("Companypolicies",CompanypoliciesSchema);
module.exports=Companypolicies;