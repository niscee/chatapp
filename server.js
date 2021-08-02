const express = require("express");
const app = express();
const PORT = 8000 || process.env.PORT;

const http = require("http");
const { userInfo } = require("os");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const messageFormat = require("./views/utils/messageFormat.js");
const {
  new_user,
  get_currentuser,
  online_users,
  user_leave,
} = require("./views/utils/users.js");

// setting up static path.
app.use(express.static("views"));

// initialzing BOTNAME.
const BOTNAME = "CHATBOT";

// runs when client connects.
io.on("connection", (socket) => {
  // socket.broadcast.emit('message', 'A User Joined the chat.') --  broadcast when a user connects except for one.
  //io.emit() -- for every user.

  // welcome msg for current single user.
  socket.on("welcomeUserServer", (username, room) => {
    const user = new_user(socket.id, username, room);

    // joining room.
    socket.join(user.room);

    // sending welcome msg to newly active user.
    socket.emit(
      "messageClient",
      messageFormat(BOTNAME, `Welcome ${user.username}.`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "messageClient",
        messageFormat(BOTNAME, `${user.username} has joined the chat.`)
      );

    //get online users.
    const onlineUsers = online_users(user.room);
    const onlineUsersName = onlineUsers.map((user) => {
      return user.username;
    });
    io.to(user.room).emit("onlineUsersClient", onlineUsersName);
  });

  // listening message from clients.
  socket.on("chatMessageServer", (msg) => {
    const currentUser = get_currentuser(socket.id);

    io.to(currentUser.room).emit(
      "messageClient",
      messageFormat(msg.username, msg.text)
    );
  });

  // runs when user disconnect.
  socket.on("disconnect", () => {
    const user = user_leave(socket.id);
    io.to(user.room).emit(
      "messageClient",
      messageFormat(BOTNAME, `${user.username} has left the chat.`)
    );

    //get online users.
    const onlineUsers = online_users(user.room);
    io.to(user.room).emit("onlineUsersClient", onlineUsers);
  });
});

server.listen(PORT, () => {
  console.log(`CHAT-APP is running at http://localhost:${PORT}`);
});
