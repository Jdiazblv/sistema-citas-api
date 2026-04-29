const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    nomUser: {
        type: String,
        required: true
    },
    passUser: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
}
);

const ModelUser = mongoose.model('usuarios', userModel);

module.exports = ModelUser;