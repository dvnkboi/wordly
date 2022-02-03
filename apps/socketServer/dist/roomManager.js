"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const shared_1 = require("shared");
class RoomManager {
    rooms;
    roomState;
    socketMap;
    io;
    constructor() {
        //!initialze maps
        this.rooms = new Map();
        this.socketMap = new Map();
        this.roomState = new Map();
        //!create server
        const httpServer = (0, http_1.createServer)();
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "*"
            }
        });
        //!on connection
        this.io.on("connection", (socket) => {
            socket.once('join', (user, room) => {
                this.addUser(room, user, socket);
            });
            socket.once('leave', () => {
                const { room, user } = this.getRoomUser(socket);
                this.removeUser(room, user, socket);
            });
            socket.on('disconnect', () => {
                const { room, user } = this.getRoomUser(socket);
                this.removeUser(room, user, socket);
            });
            socket.on('chatMsg', (msg) => {
                const { room } = this.getRoomUser(socket);
                this.chatMsg(room, msg);
            });
            socket.on('guessed', (guess, correct) => {
                const { room, user } = this.getRoomUser(socket);
                this.hanldeGuess(room, user, guess, correct);
            });
        });
    }
    //? gets room and user from socket map
    getRoomUser(socket) {
        return this.socketMap.get(socket.id) || {
            room: '',
            user: {}
        };
    }
    setRoomState(room, state) {
        this.roomState.set(room, state);
    }
    getRoomState(room) {
        return this.roomState.get(room);
    }
    //? starts server at given port
    listen(port) {
        this.io.listen(port);
    }
    //? getter for socketio server
    getIo() {
        return this.io;
    }
    //? sends msg to all users in room
    chatMsg(room, msg) {
        this.io.to(room).emit('chatMsg', msg);
    }
    //? getter for rooms map
    getRooms() {
        return this.rooms;
    }
    //? getter for specific room
    getRoom(room) {
        return this.rooms.get(room) || {};
    }
    //? adds user to room map for management, this lets us know who the users are 
    //? and what room they are in, so that new users can see the users in the room
    addUser(room, user, socket) {
        this.socketMap.set(socket.id, {
            room,
            user
        });
        const roomUsers = this.getUsers(room);
        const userId = user.id;
        roomUsers[userId] = user;
        this.rooms.set(room, roomUsers);
        socket.join(room);
        this.io.to(room).emit('roomUsersState', this.getUsers(room), this.roomState.get(room));
        this.botSpeak(room, `${user.name} has joined the room`);
        if (Object.keys(roomUsers).length === 1) {
            this.startGame(room);
        }
    }
    botSpeak(room, msg) {
        this.io.to(room).emit('bot', msg);
    }
    //? removes user from room map
    removeUser(room, user, socket) {
        this.socketMap.delete(socket.id);
        let roomUsers = this.getUsers(room);
        delete roomUsers[user.id];
        this.rooms.set(room, roomUsers);
        this.io.to(room).emit('roomUsersState', this.getUsers(room));
        this.botSpeak(room, `${user.name} has left the room`);
    }
    //? gets users that are in a room
    getUsers(room) {
        return this.rooms.get(room) || {};
    }
    startGame(room) {
        const randomWord = (0, shared_1.getWordArray)(shared_1.words[Math.floor(Math.random() * shared_1.words.length)]);
        const state = {
            round: 1,
            word: randomWord,
            ...this.countLetters(randomWord),
            alreadyGuessed: []
        };
        this.roomState.set(room, state);
        this.io.to(room).emit('startGame', this.getUsers(room), this.roomState.get(room));
        this.botSpeak(room, `game started! This word has ${state.letterCount} letters`);
    }
    countLetters(word) {
        let letterCount = 0;
        let lettersLeft = 0;
        word.forEach((letter) => {
            if (letter.ltr != ' ')
                letterCount++;
            if (!letter.isGuessed) {
                lettersLeft++;
            }
        });
        return {
            letterCount,
            lettersLeft
        };
    }
    advanceRound(room) {
        const randomWord = (0, shared_1.getWordArray)(shared_1.words[Math.floor(Math.random() * shared_1.words.length)]);
        const state = {
            round: this.roomState.get(room).round + 1,
            word: randomWord,
            ...this.countLetters(randomWord),
            alreadyGuessed: []
        };
        if (this.roomState.get(room).round >= 5) {
            state.round = 0;
            const users = this.getUsers(room);
            for (let userId in users) {
                users[userId].lives = 10;
                users[userId].score = 0;
            }
            this.rooms.set(room, users);
        }
        this.roomState.set(room, state);
        this.io.to(room).emit('advanceRound', randomWord, this.getUsers(room), this.roomState.get(room));
        this.botSpeak(room, `round ${state.round}! This word has ${state.letterCount} letters`);
    }
    hanldeGuess(room, user, guess, correct) {
        if (correct) {
            let { round, word, lettersLeft, letterCount } = this.roomState.get(room);
            word.map((letter) => {
                if (letter.ltr.toLowerCase() == guess.toLowerCase()) {
                    letter.isGuessed = true;
                    user.score += Math.ceil((0, shared_1.map)(lettersLeft, letterCount, 0, 20, 0));
                    lettersLeft--;
                }
            });
            this.roomState.set(room, {
                round,
                word,
                lettersLeft,
                letterCount,
                alreadyGuessed: [...this.roomState.get(room).alreadyGuessed, guess.toLowerCase()]
            });
            this.botSpeak(room, `${user.name} guessed ${guess} correctly!`);
            if (lettersLeft <= 0) {
                this.advanceRound(room);
            }
        }
        else {
            user.lives--;
            const alreadyGuessed = [...this.roomState.get(room).alreadyGuessed, guess.toLowerCase()];
            const state = this.roomState.get(room);
            state.alreadyGuessed = alreadyGuessed;
            this.roomState.set(room, state);
            this.botSpeak(room, `${user.name} guessed ${guess} incorrectly!`);
        }
        const roomUsers = this.getUsers(room);
        roomUsers[user.id] = user;
        this.rooms.set(room, roomUsers);
        this.io.to(room).emit('roomUsersState', this.getUsers(room), this.roomState.get(room));
    }
}
exports.RoomManager = RoomManager;
//# sourceMappingURL=roomManager.js.map