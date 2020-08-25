const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { 
        type: String,
        required: true,
        unique : true,
    },
    password: { 
        type: String,
        required: true,
    },
    bio: {
        first_name: String,
        last_name: String,
        address: String,
        telephone: String,
    },
    orders: [{ id: mongoose.Types.ObjectId }],
    active: {
        type: Boolean,
        default: true,
    },
    permission: {
        type: Number,
        default: 0,
        min: 0,
        max: 16,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}, versionKey: false })


module.exports = mongoose.model('User', UserSchema)