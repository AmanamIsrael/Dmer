const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const formatMessage = require('./utilities/messages');
const { userJoin, getCurrUser, userLeave, getRoomUsers } = require('./utilities/users');

// import static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', (socket) => {
    const botName = 'Bot'
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //welcome user
        socket.emit('message', formatMessage(botName, `Welcome to Dmer🙂 ${user.room} room`));

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat`));

        //listen for chat message
        socket.on('chatMessage', (message) => {
            const user = getCurrUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, message));
        });

        //send users & room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        //run when a user disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} has Left the chat`));
            }
            //send users & room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
})