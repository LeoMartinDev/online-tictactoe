import { EventEmitter } from 'events';
import moment from 'moment';
import _ from 'lodash';

function checkForWinner({ gameGrid }) {
  const winConditions = [
    ...[0, 3, 6].map(i => [i, i + 1, i + 2]), // horizontal
    ...[0, 1, 2].map(i => [i, i + 3, i + 6]), // vertical
    ...[[0, 4, 8], [2, 4, 6]], // diagonal
  ];

  let winner;

  for (const cellsToCheck of winConditions) {
    const cellsValuesOnGameGrid = _.at(gameGrid, cellsToCheck);
    const areCellsValuesTheSame = _.uniq(cellsValuesOnGameGrid).length === 1;

    if (areCellsValuesTheSame) {
      winner =  _.first(cellsValuesOnGameGrid);
      break;
    }
  }

  if (winner) {
    return winner;
  }

  // Check if there is remaining empty cells
  const hasEmptyCells = _.indexOf(gameGrid, 0) > -1;

  if (!hasEmptyCells && !winner) {
    return 'draw';
  }
}

export default class Game extends EventEmitter {
  constructor() {
    super();
    this.state = 'idle';
    this.gameGrid = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
    ];
    this.playersOrder = ['x', 'o'];
    this.turnsHistory = [];
  }

  getNextPlayer() {
    const currentPlayerIndex = _.indexOf(this.playersOrder, this.currentPlayer);

    if (currentPlayerIndex === this.playersOrder.length - 1) {
      return _.first(this.playersOrder);
    }

    return this.playersOrder[currentPlayerIndex + 1];
  }

  start() {
    this.currentPlayer = _.first(this.playersOrder);

    this.playerTurn({ player: this.currentPlayer });
  }

  playerPlay({ player, cell }) {
    if (this.currentPlayer !== player) {
      console.warn('Not your turn');
      return;
    }
    this.gameGrid[cell] = this.currentPlayer;

    this.turnsHistory[this.turnsHistory.length - 1] = {
      ...this.turnsHistory[this.turnsHistory.length - 1],
      cell,
    };

    this.turnEnd({ player: this.currentPlayer });
  }

  turnEnd({ player }) {
    clearTimeout(this.turnTimeoutId);

    const winner = checkForWinner({ gameGrid: this.gameGrid });

    this.emit('turnEnd', { player });

    if (winner) {
      this.emit('gameOver', { winner: player });
    }

    this.currentPlayer = this.getNextPlayer();

    this.playerTurn({ player: this.currentPlayer });
  }

  playerTurn({ player }) {
    const turnEndsAt = moment().add(5, 'seconds');

    this.turnsHistory.push({ player });

    this.turnTimeoutId = setTimeout(() => {
      this.turnEnd({ player });
    }, turnEndsAt.diff(moment(), 'milliseconds'));

    this.emit('playerTurn', {
      player,
      turnEndsAt: turnEndsAt.toDate(),
    });
  }

  pause() {
    this.state = 'paused';
    clearTimeout(this.turnTimeoudId);
  }

  resume() {
    this.state = 'playing';
    this.playerTurn({ player: this.currentPlayer })
  }

  stop() {
    clearTimeout(this.turnTimeoutId);
  }
}
