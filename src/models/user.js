const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { 
        type: mongoose.Types.String,
        required: true
    },
    password: { 
        type: mongoose.Types.String,
        required: true
    },
    bio: {
        first_name: mongoose.Types.String,
        last_name: mongoose.Types.String,
        address: mongoose.Types.String,
        telephone: mongoose.Types.String
    },
    orders: [{ id: mongoose.Types.ObjectId }],
    active: {
        type: mongoose.Types.Boolean,
        default: true
    },
    permission: {
        type: mongoose.Types.Number,
        default: 0,
        min: 0,
        max: 16
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false })


module.exports = mongoose.model('User', UserSchema)