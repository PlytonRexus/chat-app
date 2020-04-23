const mongoose = required ('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);