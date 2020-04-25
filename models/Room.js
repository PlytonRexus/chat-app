const mongoose = require ('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    active: {
        type: Boolean
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);