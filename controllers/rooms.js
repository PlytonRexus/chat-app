const Room = require ('../models/Room');
const User = require ('../models/User');

exports.saveRoomAndAddRoom = async (room, username) => {
    const foundRoomInRooms = await Room.findOne({name:room});
    console.log(foundRoomInRooms);
    if (!foundRoomInRooms) {
        var newRoom = new Room ({
            name: room,
            active: true
        });
        await newRoom.save();
    }
    const user = await User.findOne({username});
    if (user) {
        var foundRoom = user.rooms.find((val, ind, array) => {
            return val==room;
        });
        console.log(foundRoom);
        if (foundRoom) {
            return 0;
        }
        else {
            user.rooms.push({room});
            await user.save();
        }
    }
}