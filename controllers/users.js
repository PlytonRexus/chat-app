const Filter = require ('bad-words');

const filter = new Filter;
const users = [];

const addUser = ({ id, username, room, password }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (filter.isProfane(username) || filter.isProfane(room)) {
        return {
            error: 'Please do not use derogatory constructs.'
        };
    };

    if (!username || !room) {
        return {
            error: 'Username, password and room are required!'
        };
    };

    const index = users.indexOf((user) => {
        return user.username == username;
    });

    if (index != -1) {
        if (users[index].password == password) {
            return users[index].room.push(room);
        }
        else {
            return {
                error: 'Username already in use!'
            }
        }
    }

    const user = { id, username, room: [room], password };

    users.push(user);

    return { user, newroom: room };
}

const updateUser = (id, username) => {
    const index = users.findIndex((user) => {
        return user.username == username;
    });

    users[index].id = id;
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
}

const addRoom = (id, room, password) => {
    var index = users.findIndex((val, ind, arr) => {
        return val.id == id && val.password == password;
    });

    if (index == -1) {
        return {
            error: 'No such user exists!'
        }
    }
    else {
        users[index].room.push(room);
    }
}

const getAllRooms = (id) => {
    const index = users.findIndex ((val, ind, arr) => {
        return val.id == id;
    });
    if(index == -1) return {
        error: 'No such user found'
    }
    return {
        rooms: users[index].room
    };
}

module.exports = {
    users,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addRoom,
    getAllRooms
};