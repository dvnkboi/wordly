import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { map, getWordArray, words } from "shared";

interface RoomUser {
  room: string,
  user: any,
}

export class RoomManager {
  private rooms: Map<string, Record<string, any>>;
  private roomState: Map<string, any>;

  private socketMap: Map<string, RoomUser>;


  private io: Server;

  constructor() {

    //!initialze maps
    this.rooms = new Map<string, Record<string, any>>();
    this.socketMap = new Map<string, RoomUser>();
    this.roomState = new Map<string, any>();

    //!create server
    const httpServer = createServer();
    this.io = new Server(httpServer, {
      cors: {
        origin: "*"
      }
    });

    //!on connection
    this.io.on("connection", (socket: Socket) => {


      socket.once('join', (user: any, room: string) => {
        this.addUser(room, user, socket);
      });

      socket.once('leave', () => {
        const { room, user } = this.getRoomUser(socket);
        this.removeUser(room, user, socket);
      })

      socket.on('disconnect', () => {
        const { room, user } = this.getRoomUser(socket);
        this.removeUser(room, user, socket);
      });

      socket.on('chatMsg', (msg: Object) => {
        const { room } = this.getRoomUser(socket);
        this.chatMsg(room, msg);
      });

      socket.on('guessed', (guess: string, correct: boolean) => {
        const { room, user } = this.getRoomUser(socket);

        this.hanldeGuess(room, user, guess, correct);
      })

    });
  }

  //? gets room and user from socket map
  public getRoomUser(socket: Socket): RoomUser {
    return this.socketMap.get(socket.id) || {
      room: '',
      user: {}
    };
  }

  public setRoomState(room: string, state: any) {
    this.roomState.set(room, state);
  }

  public getRoomState(room: string) {
    return this.roomState.get(room);
  }


  //? starts server at given port
  public listen(port: number): void {
    this.io.listen(port);
  }

  //? getter for socketio server
  public getIo(): Server {
    return this.io;
  }

  //? sends msg to all users in room
  public chatMsg(room: string, msg: Object): void {
    this.io.to(room).emit('chatMsg', msg);
  }

  //? getter for rooms map
  public getRooms(): Map<string, Record<string, any>> {
    return this.rooms;
  }

  //? getter for specific room
  public getRoom(room: string): Record<string, any> {
    return this.rooms.get(room) || {};
  }

  //? adds user to room map for management, this lets us know who the users are 
  //? and what room they are in, so that new users can see the users in the room
  public addUser(room: string, user: any, socket: Socket): void {

    this.socketMap.set(socket.id, {
      room,
      user
    });

    const roomUsers: Record<string, any> = this.getUsers(room);

    const userId: string = user.id;
    roomUsers[userId] = user;
    this.rooms.set(room, roomUsers);

    socket.join(room);
    this.io.to(room).emit('roomUsersState', this.getUsers(room), this.roomState.get(room));

    if (Object.keys(roomUsers).length === 1) {
      this.startGame(room);
    }
  }

  //? removes user from room map
  public removeUser(room: string, user: any, socket: Socket): void {

    this.socketMap.delete(socket.id);

    let roomUsers: Record<string, any> = this.getUsers(room);
    delete roomUsers[user.id];
    this.rooms.set(room, roomUsers);

    this.io.to(room).emit('roomUsersState', this.getUsers(room));
  }

  //? gets users that are in a room
  public getUsers(room: string): Record<string, any> {
    return this.rooms.get(room) || {};
  }

  public startGame(room: string) {
    const randomWord = getWordArray(words[Math.floor(Math.random() * words.length)]);

    const state = {
      round: 1,
      word: randomWord,
      ...this.countLetters(randomWord)
    }

    this.roomState.set(room, state);

    console.log(this.getUsers(room), this.roomState.get(room))
    this.io.to(room).emit('startGame', this.getUsers(room), this.roomState.get(room));
  }

  public countLetters(word: any) {
    let letterCount = 0;
    let lettersLeft = 0;
    word.forEach((letter: any) => {
      if (letter.ltr != ' ') letterCount++;
      if (!letter.isGuessed) {
        lettersLeft++;
      }
    });
    return {
      letterCount,
      lettersLeft
    }
  }

  public advanceRound(room: string) {
    const randomWord = getWordArray(words[Math.floor(Math.random() * words.length)]);

    const state = {
      round: this.roomState.get(room).round + 1,
      word: randomWord,
      ...this.countLetters(randomWord)
    }

    this.roomState.set(room, state);
    this.io.to(room).emit('advanceRound', randomWord, this.getUsers(room), this.roomState.get(room));
  }

  public hanldeGuess(room: string, user: any, guess: string, correct: boolean) {
    if (correct) {
      let { round, word, lettersLeft, letterCount } = this.roomState.get(room);
      word.map((letter: { ltr: string; isGuessed: boolean; }) => {
        if (letter.ltr.toLowerCase() == guess.toLowerCase()) {
          letter.isGuessed = true;
          user.score += Math.ceil(map(lettersLeft, letterCount, 0, 20, 0));
          lettersLeft--;
        }
      });

      this.roomState.set(room, {
        round,
        word,
        lettersLeft,
        letterCount
      });

      if (lettersLeft <= 0) {
        this.advanceRound(room);
      }

    }
    else {
      user.lives--;
    }

    const roomUsers: Record<string, any> = this.getUsers(room);
    roomUsers[user.id] = user;
    this.rooms.set(room, roomUsers);

    this.io.to(room).emit('handleGuess', this.getUsers(room), this.roomState.get(room));
  }
}