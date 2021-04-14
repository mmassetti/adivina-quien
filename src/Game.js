import React from "react";
import Board from "./Board";
import Swal from "sweetalert2";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squaresPlayer1: Array(9).fill(""), // 3x3 board
      squaresPlayer2: Array(9).fill(""), // 3x3 board
      whosTurn: this.props.myTurn,
    };

    this.turn = "player1";
    this.gameOver = false;
  }

  componentDidMount() {
    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if (msg.message.turn === this.props.currentPlayer) {
        this.publishMove(msg.message.currentPlayer);
      }

      // Start a new round
      else if (msg.message.reset) {
        this.setState({
          squaresPlayer1: Array(9).fill(""),
          squaresPlayer2: Array(9).fill(""),
          whosTurn: this.props.myTurn,
        });

        this.turn = "player1";
        this.gameOver = false;
        Swal.close();
      }

      // End the game and go back to the lobby
      else if (msg.message.endGame) {
        Swal.close();
        this.props.endGame();
      }
    });
  }

  // newRound = (winner) => {
  //   let title = winner === null ? "Empate!" : `Ganó ${winner}!`;
  //   // Show this if the player is not the room creator
  //   if (this.props.isRoomCreator === false && this.gameOver) {
  //     Swal.fire({
  //       position: "top",
  //       allowOutsideClick: false,
  //       title: title,
  //       text: "Esperando por una ronda nueva...",
  //       confirmButtonColor: "rgb(208,33,41)",
  //       width: 275,
  //       customClass: {
  //         heightAuto: false,
  //         title: "title-class",
  //         popup: "popup-class",
  //         confirmButton: "button-class",
  //       },
  //     });
  //     this.turn = "X"; // Set turn to X so Player O can't make a move
  //   }

  //   // Show this to the room creator
  //   else if (this.props.isRoomCreator && this.gameOver) {
  //     Swal.fire({
  //       position: "top",
  //       allowOutsideClick: false,
  //       title: title,
  //       text: "¿Seguir jugando?",
  //       showCancelButton: true,
  //       confirmButtonColor: "rgb(208,33,41)",
  //       cancelButtonColor: "#aaa",
  //       cancelButtonText: "Neh",
  //       confirmButtonText: "Dale!",
  //       width: 275,
  //       customClass: {
  //         heightAuto: false,
  //         title: "title-class",
  //         popup: "popup-class",
  //         confirmButton: "button-class",
  //         cancelButton: "button-class",
  //       },
  //     }).then((result) => {
  //       // Start a new round
  //       if (result.value) {
  //         this.props.pubnub.publish({
  //           message: {
  //             reset: true,
  //           },
  //           channel: this.props.gameChannel,
  //         });
  //       } else {
  //         // End the game
  //         this.props.pubnub.publish({
  //           message: {
  //             endGame: true,
  //           },
  //           channel: this.props.gameChannel,
  //         });
  //       }
  //     });
  //   }
  // };

  // Opponent's move is published to the board
  publishMove = (currentPlayer) => {
    this.turn = currentPlayer === "player1" ? "player2" : "player1";

    this.setState({
      whosTurn: !this.state.whosTurn,
    });
  };

  onMakeMovePlayer1 = (index) => {
    const squares = this.state.squaresPlayer1;

    // Check if the square is empty and if it's the player's turn to make a move
    if (!squares[index] && this.turn === this.props.currentPlayer) {
      squares[index] = "Out";

      this.setState({
        squaresPlayer1: squares,
      });
    }
  };

  onMakeMovePlayer2 = (index) => {
    const squares = this.state.squaresPlayer2;

    // Check if the square is empty and if it's the player's turn to make a move
    if (!squares[index] && this.turn === this.props.currentPlayer) {
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
    this.turn = this.turn === "player1" ? "player2" : "player1";

    // Publish move to the channel
    this.props.pubnub.publish({
      message: {
        // index: index,
        currentPlayer: this.props.currentPlayer,
        turn: this.turn,
      },
      channel: this.props.gameChannel,
    });
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
      </div>
    );
  }
}

export default Game;
