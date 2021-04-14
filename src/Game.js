import React from "react";
import Board from "./Board";
import Swal from "sweetalert2";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squaresPlayer1: Array(9).fill(""), // 3x3 board
      squaresPlayer2: Array(9).fill(""), // 3x3 board
      xScore: 0,
      oScore: 0,
      whosTurn: this.props.myTurn,
    };

    this.turn = "X";
    this.gameOver = false;
    this.counter = 0;
  }

  componentDidMount() {
    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if (msg.message.turn === this.props.piece) {
        this.publishMove(msg.message.index, msg.message.piece);
      }

      // Start a new round
      else if (msg.message.reset) {
        this.setState({
          squaresPlayer1: Array(9).fill(""),
          squaresPlayer2: Array(9).fill(""),
          whosTurn: this.props.myTurn,
        });

        this.turn = "X";
        this.gameOver = false;
        this.counter = 0;
        Swal.close();
      }

      // End the game and go back to the lobby
      else if (msg.message.endGame) {
        Swal.close();
        this.props.endGame();
      }
    });
  }

  newRound = (winner) => {
    let title = winner === null ? "Empate!" : `Ganó ${winner}!`;
    // Show this if the player is not the room creator
    if (this.props.isRoomCreator === false && this.gameOver) {
      Swal.fire({
        position: "top",
        allowOutsideClick: false,
        title: title,
        text: "Esperando por una ronda nueva...",
        confirmButtonColor: "rgb(208,33,41)",
        width: 275,
        customClass: {
          heightAuto: false,
          title: "title-class",
          popup: "popup-class",
          confirmButton: "button-class",
        },
      });
      this.turn = "X"; // Set turn to X so Player O can't make a move
    }

    // Show this to the room creator
    else if (this.props.isRoomCreator && this.gameOver) {
      Swal.fire({
        position: "top",
        allowOutsideClick: false,
        title: title,
        text: "¿Seguir jugando?",
        showCancelButton: true,
        confirmButtonColor: "rgb(208,33,41)",
        cancelButtonColor: "#aaa",
        cancelButtonText: "Neh",
        confirmButtonText: "Dale!",
        width: 275,
        customClass: {
          heightAuto: false,
          title: "title-class",
          popup: "popup-class",
          confirmButton: "button-class",
          cancelButton: "button-class",
        },
      }).then((result) => {
        // Start a new round
        if (result.value) {
          this.props.pubnub.publish({
            message: {
              reset: true,
            },
            channel: this.props.gameChannel,
          });
        } else {
          // End the game
          this.props.pubnub.publish({
            message: {
              endGame: true,
            },
            channel: this.props.gameChannel,
          });
        }
      });
    }
  };

  // Update score for the winner
  announceWinner = (winner) => {
    let pieces = {
      X: this.state.xScore,
      O: this.state.oScore,
    };

    if (winner === "X") {
      pieces["X"] += 1;
      this.setState({
        xScore: pieces["X"],
      });
    } else {
      pieces["O"] += 1;
      this.setState({
        oScore: pieces["O"],
      });
    }
    // End the game once there is a winner
    this.gameOver = true;
    this.newRound(winner);
  };

  checkForWinner = (squares) => {
    // Possible winning combinations
    const possibleCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Iterate every combination to see if there is a match
    for (let i = 0; i < possibleCombinations.length; i += 1) {
      const [a, b, c] = possibleCombinations[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        this.announceWinner(squares[a]);
        return;
      }
    }

    // Check if the game ends in a draw
    this.counter++;
    // The board is filled up and there is no winner
    if (this.counter === 9) {
      this.gameOver = true;
      this.newRound(null);
    }
  };

  // Opponent's move is published to the board
  publishMove = (index, piece) => {
    console.log("🚀 ~ file: Game.js ~ line 173 ~ Game ~ piece", piece);
    if (piece === "X") {
      const squares = this.state.squaresPlayer1;

      squares[index] = piece;
      this.turn = squares[index] === "X" ? "O" : "X";

      this.setState({
        squaresPlayer1: squares,
        whosTurn: !this.state.whosTurn,
      });

      this.checkForWinner(squares);
    } else {
      const squares = this.state.squaresPlayer2;

      squares[index] = piece;
      this.turn = squares[index] === "X" ? "O" : "X";

      this.setState({
        squaresPlayer2: squares,
        whosTurn: !this.state.whosTurn,
      });

      this.checkForWinner(squares);
    }
  };

  onMakeMovePlayer1 = (index) => {
    const squares = this.state.squaresPlayer1;

    // Check if the square is empty and if it's the player's turn to make a move
    if (!squares[index] && this.turn === this.props.piece) {
      squares[index] = "Out";

      this.setState({
        squaresPlayer1: squares,
      });
    }
  };

  onMakeMovePlayer2 = (index) => {
    const squares = this.state.squaresPlayer2;

    // Check if the square is empty and if it's the player's turn to make a move
    if (!squares[index] && this.turn === this.props.piece) {
      squares[index] = "Out";

      this.setState({
        squaresPlayer2: squares,
      });
    }
  };

  onFinishMovePlayer = () => {
    this.setState({
      whosTurn: !this.state.whosTurn,
    });

    // Other player's turn to make a move
    this.turn = this.turn === "X" ? "O" : "X";

    // Publish move to the channel
    this.props.pubnub.publish({
      message: {
        // index: index,
        piece: this.props.piece,
        turn: this.turn,
      },
      channel: this.props.gameChannel,
    });

    // Check if there is a winner
    // this.checkForWinner(squares);
  };

  render() {
    let status;
    // Change to current player's turn
    status = `${this.state.whosTurn ? "Te toca a vos" : "Le toca a tu rival"}`;

    return (
      <div className="game">
        <div className="board">
          {this.props.isRoomCreator ? (
            <Board
              squares={this.state.squaresPlayer1}
              onClick={(index) => this.onMakeMovePlayer1(index)}
            />
          ) : (
            <Board
              squares={this.state.squaresPlayer2}
              onClick={(index) => this.onMakeMovePlayer2(index)}
            />
          )}

          <p className="status-info">{status}</p>
        </div>

        <button onClick={this.onFinishMovePlayer}>Listo!</button>

        <div className="scores-container">
          <div>
            <p>Player X: {this.state.xScore} </p>
          </div>

          <div>
            <p>Player O: {this.state.oScore} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
