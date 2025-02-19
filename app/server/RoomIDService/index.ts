import shortID from 'shortid';
import crypto from 'crypto';

export default class RoomIDService {
  takenRoomIDs: Set<string>;

  nextSimpleRoomID: number;

  constructor() {
    this.takenRoomIDs = new Set<string>();
    this.nextSimpleRoomID = 1;
    // TODO: load saved taken room ids from local storage, will be useful for saved devices feature in FUTURE
  }

  getSimpleAvailableRoomID(): Promise<string> {
    this.nextSimpleRoomID += 1;
    return new Promise<string>((resolve) => {
      crypto.randomBytes(3, (_, _buffer) => {
        resolve(/* parseInt(_buffer.toString('hex'), 16).toString().substr(0, 6) */ '123456');
      });
    });
  }

  getShortIDStringOfAvailableRoom(): Promise<string> {
    return new Promise<string>((resolve) => {
      let newID = shortID();
      while (this.takenRoomIDs.has(newID)) {
        newID = shortID();
      }
      resolve(newID);
    });
  }

  markRoomIDAsTaken(id: string) {
    this.takenRoomIDs.add(id);
  }

  unmarkRoomIDAsTaken(id: string) {
    this.takenRoomIDs.delete(id);
  }

  isRoomIDTaken(id: string) {
    return this.takenRoomIDs.has(id);
  }
}
