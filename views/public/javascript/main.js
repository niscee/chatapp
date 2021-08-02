const socket = io();
let submitButton = document.getElementById("send-message");
let inputField = document.getElementById("chat-message");
let chatmessages = document.querySelector(".message-collection");

//fetching url parameter using QS module.
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// welcoming new user in the room, sending to server.
socket.emit("welcomeUserServer", username, room);

// runs when user submit the message.
submitButton.addEventListener("click", () => {
  let msg = { username, room, text: inputField.value };

  // emiting chat message to the server.
  socket.emit("chatMessageServer", msg);
  inputField.value = "";
  inputField.focus();
});

// receiving server messages.
socket.on("messageClient", (message) => {
  // adding message to chat collection.
  addNode(message);

  // scroll down chat.
  chatmessages.scrollTop = chatmessages.scrollHeight;
});

// receiving online users from specific room.
socket.on("onlineUsersClient", (users) => {
  // adding new users in the active list.
  let div = document.getElementById("active-users");
  div.innerHTML = `
   ${users.map((user) => `<li>${user.username}</li>`)}`;
});


// adding new node in the dom for new chat message.
const addNode = (message) => {
  const div = document.createElement("div");

  if (message.username === username) {
    div.classList.add("message1");
  } else if (message.username === "CHATBOT") {
    div.classList.add("messageadmin");
  } else {
    div.classList.add("message");
  }

  div.innerHTML = `<p id="message-username">${message.username} (${message.time})</p>
    <p id="message-content">${message.text}</p>`;
  const msgCollection = document.querySelector(".message-collection");
  msgCollection.append(div);
};

// receiving active user list from server.
socket.on("activeUsersClient", (users) => {
  // list of active users.
  onlineUsers(users);
});
