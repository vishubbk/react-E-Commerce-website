const mongoose = require("mongoose");

const userSchema  = new mongoose.Schema({
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
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
        orders: {
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
    picture: {
        data: Buffer, // Binary data for the image
        contentType: String, // MIME type (e.g., 'image/png', 'image/jpeg')
    },

})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;
