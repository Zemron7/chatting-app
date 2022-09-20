const users = [];

//Join user to the chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

//Get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

function checkIfNameTaken(username, room){
    const currentUsers = getRoomUsers(room);

    for(let i = 0; i < currentUsers.length; i++){
        if(currentUsers[i] === username){
            return true;
        }
    }
    return false;

}

module.exports = {userJoin, getCurrentUser, userLeave, getRoomUsers, checkIfNameTaken};