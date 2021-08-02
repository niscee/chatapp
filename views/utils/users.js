// array to store active users.
let user_list = []


// join user to chat.
const new_user = (id, username, room) => {
    const user = {id, username, room};
    user_list.push(user);
    return user;
}


// get current user.
const get_currentuser = (id) => {
    return user_list.find(user => user.id === id);
}


// user leave.
const user_leave = (id) => {
    const index = user_list.findIndex(user => user.id === id);

    if(index != -1){
        return user_list.splice(index, 1)[0];
    }
}

// get room users.
const online_users = (room) => {
    return user_list.filter(user => user.room === room);
}

module.exports = { new_user, get_currentuser, online_users, user_leave };