import React from "react";
import Board from "./Board";
import Swal from "sweetalert2";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Link } from "react-router-dom";

class Game extends React.Component {
  constructor(props) {
    super(props);

    let imagesUrls = [];
    for (let i = 0; i < 16; i++) {
      imagesUrls.push({
        url:
          "https://res.cloudinary.com/sebanoe/image/upload/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png",
        show: true,
      });
    }

    this.state = {
      squaresPlayer1: imagesUrls,
      squaresPlayer2: imagesUrls,
      whosTurn: this.props.myTurn,
    };

    this.turn = "player1";
    this.gameOver = false;
  }

  componentDidMount() {
    let imagesUrls = [];
    for (let i = 0; i < 16; i++) {
      imagesUrls.push({
        url:
          "https://res.cloudinary.com/sebanoe/image/upload/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png",
        show: true,
      });
    }

    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if (msg.message.turn === this.props.currentPlayer) {
        this.publishMove(msg.message.currentPlayer);
      }

      // Start a new round
      else if (msg.message.reset) {
        this.setState({
          squaresPlayer1: imagesUrls,
          squaresPlayer2: imagesUrls,
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
    // if (!squares[index] && this.turn === this.props.currentPlayer) {
    if (this.turn === this.props.currentPlayer) {
      const square = squares[index];

      if (square.show) {
        square.url =
          "https://res.cloudinary.com/sebanoe/image/upload/e_grayscale/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png";
      } else {
        square.url =
          "https://res.cloudinary.com/sebanoe/image/upload/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png";
      }

      square.show = !square.show;

      this.setState({
        squaresPlayer1: squares,
      });
    }
  };

  onMakeMovePlayer2 = (index) => {
    const squares = this.state.squaresPlayer2;

    // Check if the square is empty and if it's the player's turn to make a move
    // if (!squares[index] && this.turn === this.props.currentPlayer) {
    if (this.turn === this.props.currentPlayer) {
      const square = squares[index];

      if (square.show) {
        square.url =
          "https://res.cloudinary.com/sebanoe/image/upload/e_grayscale/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png";
      } else {
        square.url =
          "https://res.cloudinary.com/sebanoe/image/upload/v1618695432/AdivinaQuien/futbolistas/messi_iwjxgq.png";
      }

      square.show = !square.show;

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
    //TODO: Darle color verde y rojo a esto
    status = `${this.state.whosTurn ? "Te toca a vos" : "Le toca a tu rival"}`;

    return (
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />

        <main className="flex-grow">
          <section className="relative">
            <>
              <div
                className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
                aria-hidden="true"
              ></div>
              <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-12 md:pt-20">
                  {/* Section header */}
                  <Link
                    to="/"
                    className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    ⬅ Menú principal
                  </Link>

                  <div className="max-w-3xl mx-auto text-center pb-6 md:pb-8">
                    <h1 className="h2 mb-4">¡Adivina quién!</h1>
                  </div>

                  {/* Content */}

                  <section class="text-gray-600 body-font">
                    <div class="container mx-auto flex items-center md:flex-row flex-col">
                      <div class="flex flex-col md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
                        <div>
                          <p className="status-info">{status}</p>

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
                        </div>

                        <button onClick={this.onFinishMovePlayer}>
                          Listo!
                        </button>
                      </div>
                      <div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
                        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            class="w-6 h-6"
                            viewBox="0 0 305 305"
                          >
                            <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
                            <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
                          </svg>
                          <span class="ml-4 flex items-start flex-col leading-none">
                            <span class="title-font font-medium">
                              Tomá notas
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          </section>
        </main>

        <Footer />
      </div>
    );
  }
}

export default Game;
