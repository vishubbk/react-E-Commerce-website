const mongoose = require("mongoose");

const ownerSchema  = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,

    },
    lastname:{
        type:String,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    product: {
      type: Array,
      default: [],
  },
     password:{
        type:String,
        required:true,
    },
    contact:{
        type:String,

    },
    profilePicture: {
      data: Buffer, // Binary data for the image
      contentType: String, // MIME type (e.g., 'image/png', 'image/jpeg')
  },
    balance:{
        type:Number,
        default:2000,
    },

})

const ownerModel = mongoose.model("Owner",ownerSchema);

module.exports = ownerModel;
