"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*"
    }
});
console.log("Socket server started");
const rooms = new Map();
io.on("connection", (socket) => {
    socket.on('join', (user, room) => {
        socket.__user = {};
        socket.__user = Object.assign(socket.__user, user);
        socket.__room = room;
        const roomUsers = rooms.get(room) || {};
        const userId = user.id;
        delete user.id;
        roomUsers[userId] = user;
        rooms.set(room, roomUsers);
        socket.join(room);
        io.to(socket.__room).emit('roomUsersState', roomUsers);
    });
    socket.on('disconnect', () => {
        const roomUsers = rooms.get(socket.__room) || {};
        delete roomUsers[socket.__user.id];
        console.log(socket.__user.id, 'disconnected');
        rooms.set(socket.__room, roomUsers);
        io.to(socket.__room).emit('roomUsersState', roomUsers);
    });
    socket.on('chatMsg', (msg) => {
        console.log('msg', msg, socket.__user);
        io.to(socket.__room).emit('chatMsg', msg);
    });
});
io.listen(3001);
//# sourceMappingURL=index.js.map