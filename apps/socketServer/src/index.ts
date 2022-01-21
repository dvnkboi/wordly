import { map } from 'shared';
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

console.log("Socket server started");

const rooms = new Map<string, Record<string, any>>();

io.on("connection", (socket: any) => {


  socket.on('join', (user: any, room: string) => {

    socket.__user = {};
    socket.__user = Object.assign(socket.__user, user);
    socket.__room = room;

    const roomUsers: Record<string, any> = rooms.get(room) || {};
    const userId: string = user.id;
    delete user.id;
    roomUsers[userId] = user;
    rooms.set(room, roomUsers);

    socket.join(room);
    io.to(socket.__room).emit('roomUsersState', roomUsers);
  });

  socket.on('disconnect', () => {
    const roomUsers: Record<string, any> = rooms.get(socket.__room) || {};
    delete roomUsers[socket.__user.id];
    console.log(socket.__user.id, 'disconnected');
    rooms.set(socket.__room, roomUsers);
    io.to(socket.__room).emit('roomUsersState', roomUsers);
  });

  socket.on('chatMsg', (msg: Object) => {
    console.log('msg', msg, socket.__user);
    io.to(socket.__room).emit('chatMsg', msg);
  });



});

io.listen(3001);