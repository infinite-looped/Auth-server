//User schema and indexes
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password:{
        type: String,
        default: null,
    },
    roles:{
        type: [String],
        default: ["USER"]
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
   
},
{
    timestamps: true //created and updated at
}
);

module.exports = mongoose.model("User", userSchema)