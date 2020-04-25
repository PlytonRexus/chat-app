const Room = require ('../models/Room');
const User = require ('../models/User');

exports.saveRoomAndAddRoom = async (room, username) => {
    const foundRoomInRooms = await Room.findOne({name:room});
    console.log('foundRoomInRooms:', foundRoomInRooms);
    if (foundRoomInRooms == null) {
        var newRoom = new Room ({
            name: room,
            active: true
        });
        await newRoom.save();
    }
    const user = await User.findOne({username});
    if (user) {
        var foundRoom = user.rooms.findIndex((val, ind, array) => {
            return val.room == room;
        });
        console.log('foundRoom',foundRoom);
        if (foundRoom >= 0) {
            return 'Nothing to save.';
        }
        else {
            user.rooms.push({room});
            await user.save();
        }
    }
}