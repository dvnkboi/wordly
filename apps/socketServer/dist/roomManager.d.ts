import { Server, Socket } from "socket.io";
interface RoomUser {
    room: string;
    user: any;
}
export declare class RoomManager {
    private rooms;
    private roomState;
    private socketMap;
    private httpServer;
    private io;
    constructor();
    getRoomUser(socket: Socket): RoomUser;
    setRoomState(room: string, state: any): void;
    getRoomState(room: string): any;
    listen(port: number): void;
    getIo(): Server;
    chatMsg(room: string, msg: Object): void;
    getRooms(): Map<string, Record<string, any>>;
    getRoom(room: string): Record<string, any>;
    addUser(room: string, user: any, socket: Socket): void;
    botSpeak(room: string, msg: string): void;
    removeUser(room: string, user: any, socket: Socket): void;
    getUsers(room: string): Record<string, any>;
    startGame(room: string): void;
    countLetters(word: any): {
        letterCount: number;
        lettersLeft: number;
    };
    advanceRound(room: string): void;
    hanldeGuess(room: string, user: any, guess: string, correct: boolean): Promise<void>;
}
export {};
//# sourceMappingURL=roomManager.d.ts.map