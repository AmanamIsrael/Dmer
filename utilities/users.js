const users = [];

//join user

function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function getCurrUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrUser, userLeave, getRoomUsers }