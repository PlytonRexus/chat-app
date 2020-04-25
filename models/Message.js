const mongoose = require ('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        default: ''
    },
    sender: {
        type: String,
        trim: true,
        required: true
    },
    room: {
        type: String,
        trim: true,
        required: true
    },
    read: {
        type: Boolean
    },
    sentAt: {
        type: Number,
        required: true
    },
    image: {
        type: Buffer
    },
    format: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);