import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { waitFor } from '../core/utils/time.js';
import Game from './Game.js';
// rename to Room
class Room {

  constructor(roomId) {
    this.roomId = roomId;
    this.state = 'waitingForUsers';
    this.users = {};
    this.socket = undefined;
    this.game = undefined;
  }

  sendMessageToAllUsers({ message }) {
    _.forEach(this.users, ({ playerId }) => {
      this.sendMessageToOneUser({ playerId, message });
    });
  }

  sendMessageToOneUser({ playerId, message }) {
    const player = this.users[playerId];

    if (!player) {
      console.warn(`Cannot find player with id ${playerId}!`);
      return;
    }
    player.socket.send(message);
  }

  join({ userId, socket }) {
    if (_.size(this.users) > MAX_PLAYERS) {
      throw new Error('Room players limit reached!');
    }

    if (this.users[userId]) {
      throw new Error('Player already in room!');
    }

    this.users[userId] = {
      playerId: userId,
      socket,
    };

    socket.on('close', () => {
      console.log('Socket closed for', userId);
    });
  }

  async startRoom() {
    this.state = 'roomStarting';
    const roomStartsAt = moment().add(3, 'seconds').toDate();

    this.sendMessageToAllUsers({
      message: {
        type: 'roomStarting',
        roomStartsAt,
      },
    });

    await waitFor(roomStartsAt.getTime() - Date.now());

    this.sendMessageToAllUsers({
      message: {
        type: 'roomStarted',
      },
    });
  }
}

export {
  createRoom,
  joinRoomById,
};

const rooms = {};

function createRoom() {
  const gameId = uuidv4();

  games[gameId] = new Game(gameId);

  return gameId;
}

function getRoomById({ roomId }) {
  return rooms[roomId];
}

function joinRoomById({ roomId, userId, socket }) {
  const room = rooms[roomId];

  if (!room) {
    throw new Error('Room does not exist!');
  }

  room.join({ roomId, userId, socket });
}
