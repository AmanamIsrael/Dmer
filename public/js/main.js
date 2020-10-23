document.getElementById('leave').addEventListener('click', () => {
    history.back();
});

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room });

//listen for message
socket.on('message', (message) => {
    displayMessage(message);
});

socket.on('roomUsers', ({ room, users }) => {
    displayRoomName(room);
    displayRoomUsers(users);
})

document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('messageBox');
    // emit message to server
    socket.emit('chatMessage', input.value);
    input.value = '';
    input.focus();
})

function displayMessage(message) {
    const wrapper = document.querySelector('.chat-box');
    const div = document.createElement('div');
    div.classList.add('message', 'p-2', 'my-2');
    div.innerHTML = `
    <h6 class="m-0">${message.text}</h6>
    <small class="text-info">${message.username} ${message.time}</small>
    `;
    wrapper.appendChild(div);
    wrapper.scrollTop = wrapper.scrollHeight;
}

function displayRoomName(room) {
    const roomEl = document.getElementById('roomname');
    roomEl.innerHTML = `<b>Chat Room: <span class="text-info">${room}</span><b>`
}

function displayRoomUsers(users) {
    const roomWrapper = document.getElementById('users');
    roomWrapper.innerHTML = `${users.map(user => `<li class="d-block">${user.username}</li>`).join('')}`
}